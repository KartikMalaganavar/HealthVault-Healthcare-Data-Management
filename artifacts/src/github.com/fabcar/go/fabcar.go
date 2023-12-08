package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"strconv"
	"time"
	"github.com/hyperledger/fabric-chaincode-go/pkg/cid"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
	"github.com/hyperledger/fabric/common/flogging"
)

type SmartContract struct {
	contractapi.Contract
}



// https://github.com/adhavpavan/FabricNetwork-2.x.git


var logger = flogging.MustGetLogger("fabcar_cc")

type Car struct {
	ID      string `json:"id"`
	Make    string `json:"make"`
	Model   string `json:"model"`
	Color   string `json:"color"`
	Owner   string `json:"owner"`
	AddedAt uint64 `json:"addedAt"`
}


// 		CREATE
func (s *SmartContract) CreateCar(ctx contractapi.TransactionContextInterface, carData string) (string, error) {

		//   (string, error) >> are the return types
	if len(carData) == 0 {
		return "", fmt.Errorf("Please pass the correct car data")
	}

	var car Car
	err := json.Unmarshal([]byte(carData), &car)
	if err != nil {
		return "", fmt.Errorf("Failed while unmarshling car. %s", err.Error())
	}

	carAsBytes, err := json.Marshal(car)
	if err != nil {
		return "", fmt.Errorf("Failed while marshling car. %s", err.Error())
	}

	// json.Mar............


	ctx.GetStub().SetEvent("CreateAsset", carAsBytes)
	// code sets a custom event on the transaction context using the SetEvent method of the ctx.GetStub() object.
	//  The first argument of the SetEvent method is a string that identifies the type of event being set, 
	// in this case "CreateAsset". The second argument is the serialized data carAsBytes, which will be included in the event payload.

	return ctx.GetStub().GetTxID(),  ctx.GetStub().PutState(car.ID, carAsBytes)
	// ctx.GetStub().GetTxID() >> returns a string type of the txID 
	// ctx.GetStub().PutState(car.ID, carAsBytes) >> if there'sany error while adding the data into the Ledger
}

func (s *SmartContract) ABACTest(ctx contractapi.TransactionContextInterface, carData string) (string, error) {

	mspId, err := cid.GetMSPID(ctx.GetStub())
	if err != nil {
		return "", fmt.Errorf("failed while getting identity. %s", err.Error())
	}
	if mspId != "Org2MSP" {
		return "", fmt.Errorf("You are not authorized to create Car Data")
	}

	if len(carData) == 0 {
		return "", fmt.Errorf("Please pass the correct car data")
	}

	var car Car
	err = json.Unmarshal([]byte(carData), &car)
	if err != nil {
		return "", fmt.Errorf("Failed while unmarshling car. %s", err.Error())
	}

	carAsBytes, err := json.Marshal(car)
	if err != nil {
		return "", fmt.Errorf("Failed while marshling car. %s", err.Error())
	}

	ctx.GetStub().SetEvent("CreateAsset", carAsBytes)

	return ctx.GetStub().GetTxID(), ctx.GetStub().PutState(car.ID, carAsBytes)
}

func (s *SmartContract) CreatePrivateDataImplicitForOrg1(ctx contractapi.TransactionContextInterface, carData string) (string, error) {

	if len(carData) == 0 {
		return "", fmt.Errorf("please pass the correct document data")
	}

	var car Car
	err := json.Unmarshal([]byte(carData), &car)
	if err != nil {
		return "", fmt.Errorf("failed while un-marshalling document. %s", err.Error())
	}

	carAsBytes, err := json.Marshal(car)
	if err != nil {
		return "", fmt.Errorf("failed while marshalling car. %s", err.Error())
	}

	return ctx.GetStub().GetTxID(), ctx.GetStub().PutPrivateData("_implicit_org_Org1MSP", car.ID, carAsBytes)
}

//  	MODIFY
func (s *SmartContract) UpdateCarOwner(ctx contractapi.TransactionContextInterface, carID string, newOwner string) (string, error) {

	// carID and newOwner is the name that you want to give to the old car

	if len(carID) == 0 {
		return "", fmt.Errorf("Please pass the correct car id")
	}

	carAsBytes, err := ctx.GetStub().GetState(carID)
	// carAsBytes pulling the details of the old owner using carID


	if err != nil {
		return "", fmt.Errorf("Failed to get car data. %s", err.Error())
	}

	if carAsBytes == nil {
		return "", fmt.Errorf("%s does not exist", carID)
	}

	car := new(Car)
	// creating new "Car struct" with name as "car"

	_ = json.Unmarshal(carAsBytes, car)
	// from hori....to verticals
	// from - to | 
	
	// "UNMARSHAL"   >>  string to structure              that means carasBytes is cinv to a struct type 
	// "MARSHAL"   >>  structure to string

	car.Owner = newOwner

	carAsBytes, err = json.Marshal(car)
	if err != nil {
		return "", fmt.Errorf("Failed while marshling car. %s", err.Error())
	}

	//  txId := ctx.GetStub().GetTxID()

	return			 ctx.GetStub().GetTxID(),			 ctx.GetStub().PutState(car.ID, carAsBytes)

	// as int the abv fun you defined that the return types are the txID and the state after the putstate methods are returned 

}



//  Patient History
func (s *SmartContract) GetHistoryForAsset(ctx contractapi.TransactionContextInterface, carID string) (string, error) {

	resultsIterator, err := ctx.GetStub().GetHistoryForKey(carID)
	if err != nil {
		return "", fmt.Errorf(err.Error())
	}

	defer resultsIterator.Close()

	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false

	for resultsIterator.HasNext() {
		response, err := resultsIterator.Next()
		if err != nil {
			return "", fmt.Errorf(err.Error())
		}
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"TxId\":")
		buffer.WriteString("\"")
		buffer.WriteString(response.TxId)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Value\":")
		if response.IsDelete {
			buffer.WriteString("null")
		} else {
			buffer.WriteString(string(response.Value))
		}

		buffer.WriteString(", \"Timestamp\":")
		buffer.WriteString("\"")
		buffer.WriteString(time.Unix(response.Timestamp.Seconds, int64(response.Timestamp.Nanos)).String())
		buffer.WriteString("\"")

		buffer.WriteString(", \"IsDelete\":")
		buffer.WriteString("\"")
		buffer.WriteString(strconv.FormatBool(response.IsDelete))
		buffer.WriteString("\"")

		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	return string(buffer.Bytes()), nil
}

// 		QUERY ( PATIENT ID )    
// Also write a code for QUERY ( PATIENT NAME )

func (s *SmartContract) GetCarById(ctx contractapi.TransactionContextInterface, carID string) (*Car, error) {
	// carID >> arg >> input

	if len(carID) == 0 {
		return nil, fmt.Errorf("Please provide correct contract Id")
		// return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	// frm ledger getting the car details
	carAsBytes, err := ctx.GetStub().GetState(carID)

	if err != nil {
		return nil, fmt.Errorf("Failed to read from world state. %s", err.Error())
	}

	if carAsBytes == nil {
		return nil, fmt.Errorf("%s does not exist", carID)
	}

		// NEW STRUCT as CAR
	car := new(Car)
	_ = json.Unmarshal(carAsBytes, car)
	//  " _ " >> is the var i.e to ber used only once
	// "UNMARSHAL"   >>  string to structure              that means carasBytes is cinv to a struct type 
	// "MARSHAL"   >>  structure to string
	// the carAsBytes(string)		to      car(struct)
	// values will be copied to car struct
	return car, nil
	// return car(struct) and nill error

}


func (s *SmartContract) DeleteCarById(ctx contractapi.TransactionContextInterface, carID string) (string, error) {
	if len(carID) == 0 {
		return "", fmt.Errorf("Please provide correct contract Id")
	}

	return ctx.GetStub().GetTxID(), ctx.GetStub().DelState(carID)
}

func (s *SmartContract) GetContractsForQuery(ctx contractapi.TransactionContextInterface, queryString string) ([]Car, error) {

	queryResults, err := s.getQueryResultForQueryString(ctx, queryString)

	if err != nil {
		return nil, fmt.Errorf("Failed to read from ----world state. %s", err.Error())
	}

	return queryResults, nil

}

func (s *SmartContract) getQueryResultForQueryString(ctx contractapi.TransactionContextInterface, queryString string) ([]Car, error) {

	resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	results := []Car{}

	for resultsIterator.HasNext() {
		response, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		newCar := new(Car)

		err = json.Unmarshal(response.Value, newCar)
		if err != nil {
			return nil, err
		}

		results = append(results, *newCar)
	}
	return results, nil
}

func (s *SmartContract) GetDocumentUsingCarContract(ctx contractapi.TransactionContextInterface, documentID string) (string, error) {
	if len(documentID) == 0 {
		return "", fmt.Errorf("Please provide correct contract Id")
	}

	params := []string{"GetDocumentById", documentID}
	queryArgs := make([][]byte, len(params))
	for i, arg := range params {
		queryArgs[i] = []byte(arg)
	}

	response := ctx.GetStub().InvokeChaincode("document_cc", queryArgs, "mychannel")

	return string(response.Payload), nil

}

func (s *SmartContract) CreateDocumentUsingCarContract(ctx contractapi.TransactionContextInterface, functionName string, documentData string) (string, error) {
	if len(documentData) == 0 {
		return "", fmt.Errorf("Please provide correct document data")
	}

	params := []string{functionName, documentData}
	queryArgs := make([][]byte, len(params))
	for i, arg := range params {
		queryArgs[i] = []byte(arg)
	}

	response := ctx.GetStub().InvokeChaincode("document_cc", queryArgs, "mychannel")

	return string(response.Payload), nil

}

func main() {

	chaincode, err := contractapi.NewChaincode(new(SmartContract))
	if err != nil {
		fmt.Printf("Error create fabcar chaincode: %s", err.Error())
		return
	}
	if err := chaincode.Start(); err != nil {
		fmt.Printf("Error starting chaincodes: %s", err.Error())
	}

}
