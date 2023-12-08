
exports.buildCAClient = (FabricCAServices, ccp, caHostName) => {
    const caInfo = ccp.certificateAuthorities[caHostName]; 
    const caTLSCACerts = caInfo.tlsCACerts.pem;
    const caClient = new FabricCAServices(caInfo.url, {trustedRoots: caTLSCACerts, verify: false}, caInfo.caName);
  
    console.log(`Built a CA Client named ${caInfo.caName}`);
    return caClient;
  };

exports.enrollAdmin = async (caClient, wallet, orgMspId, adminUserId, adminUserPasswd, key, value) => {
    try {
      const identity = await wallet.get(adminUserId);
      if (identity) {
        console.log('An identity for the admin user already exists in the wallet');
        return;
      }

      // const registrar = {
      //   enrollmentID: 'admin',
      //   enrollmentSecret: 'adminpw',
      // };


      // const secret = await caClient.register({
        
      //   enrollmentID: adminUserId,
      //   enrollmentSecret: adminUserPasswd,
      //   registrar,
      //   // NOTE: Role must be client, other roles access is denied
      //   // TODO: Check if other roles access can be granted in the ca config files of the organizations.
      //   // Changes to be made in fabric-ca-server-config.yaml ?? hf.Registrar.Roles and maps
      //   attrs: [{
      //     name: key,
      //     value: value,
      //     ecert: true,
      //   }],
      // });


      
      
      
        
      const enrollment = await caClient.enroll({enrollmentID: adminUserId, enrollmentSecret: adminUserPasswd,
          attrs: [{
          name: key,
          value: value,
          ecert: true,
        }],
      });
      const x509Identity = {
        credentials: {
          certificate: enrollment.certificate,
          privateKey: enrollment.key.toBytes(),
        },
        mspId: orgMspId,
        type: 'X.509',
      };
      await wallet.put(adminUserId, x509Identity);
      console.log('Successfully enrolled admin user and imported it into the wallet');
    } catch (error) {
      console.error(`Failed to enroll admin user : ${error}`);
    }
  };
  

  exports.registerAndEnrollUser = async (caClient, wallet, orgMspId, userId, adminUserId, attributes, affiliation) => {
    try {
      // Check to see if we've already enrolled the user
      const userIdentity = await wallet.get(userId);
      // console.log("1");
      if (userIdentity) {
        console.log(`An identity for the user ${userId} already exists in the wallet`);
        throw new Error(`An identity for the user ${userId} already exists in the wallet`);
      }
      // console.log("2");
      const admin = "admin";
      // Must use an admin to register a new user
      const adminIdentity = await wallet.get(admin);
      if (!adminIdentity) {
        console.log(`An identity for the admin user ${admin} does not exist in the wallet`);
        throw new Error(`An identity for the admin user ${admin} does not exist in the wallet`);
      }
      // console.log("3");
      // build a user object for authenticating with the CA
      const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
      const adminUser = await provider.getUserContext(adminIdentity, admin);
      // console.log( provider, adminUser);
      // Get all the parameters from the JSON string
      attributes = JSON.parse(attributes);
      const attrs = attributes;
      const key = attrs.key;
      const value = attrs.value;
      const firstName = attrs.firstName;
      const lastName = attrs.lastName;
      //const role = attributes.role;
      //const speciality = (role === 'doctor') ? attributes.speciality : '';
  
      console.log(key, value, firstName, lastName);
      // Register the user, enroll the user, and import the new identity into the wallet.
      // if affiliation is specified by client, the affiliation value must be configured in CA
      // NOTE: Pubic key can be added into attrs
      const secret = await caClient.register({
        affiliation: affiliation,
        enrollmentID: userId,
        // NOTE: Role must be client, other roles access is denied
        // TODO: Check if other roles access can be granted in the ca config files of the organizations.
        // Changes to be made in fabric-ca-server-config.yaml ?? hf.Registrar.Roles and maps
        role: 'client',
        attrs: [{
          name: 'firstName',
          value: firstName,
          ecert: true,
        },
        {
          name: 'lastName',
          value: lastName,
          ecert: true,
        },
        /*{
          name: 'role',
          value: role,
          ecert: true,
        },*/
        {
          name: key,
          value: value,
          ecert: true,
        }],
      }, adminUser);
      const enrollment = await caClient.enroll({
        enrollmentID: userId,
        enrollmentSecret: secret,
        attrs: [{
          name: 'firstName',
          value: firstName,
          ecert: true,
        },
        {
          name: 'lastName',
          value: lastName,
          ecert: true,
        },
        /*{
          name: 'role',
          value: role,
          ecert: true,
        },*/
        {
          name: key,
          value: value,
          ecert: true,
        }],
      });

      
      const x509Identity = {
        credentials: {
          certificate: enrollment.certificate,
          privateKey: enrollment.key.toBytes(),
        },
        mspId: orgMspId,
        type: 'X.509',
      };
      await wallet.put(userId, x509Identity);
      console.log(`Successfully registered and enrolled user ${userId} and imported it into the wallet`);
    } catch (error) {
      console.error(`Failed to register user ${userId} : ${error}`);
      throw new Error(`Failed to register user ${userId}`);
    }
  };
  