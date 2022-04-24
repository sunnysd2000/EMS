pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;
contract Evidences{
    uint public ecount=0;

    struct Evid{
        uint caseno;
        uint id;
        string data;
        string capsule;
        string ownername;

    }
    mapping(uint => Evid)public evidarray;

    function createEvidence(uint _caseno,uint _id,string memory _data,string memory _capsule,string memory _ownername)public{
        ecount++;
        evidarray[ecount]=Evid(_caseno, _id, _data, _capsule,_ownername);

    }
    


}