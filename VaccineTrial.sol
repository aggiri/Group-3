// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.5;


/**
 * @title Utility super-class to provide basic ownership features
 */
contract Ownable {
    
    /// Current contract owner
    address public owner;
    
    constructor() {
        owner = msg.sender;
    }
    
    /// Allowed only by the owner
    modifier onlyOwner {
        require(msg.sender == owner, "Only the owner is allowed to perform this action!");
        _;
    }
}

/**
 * @title Base contract to keep track of authorized volunteers 
 */
contract Volunteers {

    struct Volunteer {
        uint256 dob;
        uint gender;
        string medical_precondition_code;
        bool other_vaccine_taken;
        string other_vaccine_name;
        uint256 other_vaccination_date;
        bool doesExist;
        bool isApproved;
    }

    mapping (address => Volunteer) private volunteers;
    
  
 
    
    /**
     * Notify whenever a volunteer is added
     * @param volunteer Address of the added volunteer
     */
    event VolunteerAdded(address volunteer);
    
    /**
     * Notify whenever a volunteer is approved
     * @param volunteer Address of the volunteer approved
     */
    event VolunteerApproved(address volunteer);

    function addVolunteer(uint256 dob, uint gender, string memory medical_precondition_code, bool other_vaccine_taken, string memory other_vaccine_name, uint256 other_vaccination_date) public {
        address volunteer = msg.sender;

        require(volunteers[volunteer].doesExist != true, "Volunteer already exists");

        volunteers[volunteer] = Volunteer({
            doesExist: true,
            isApproved: false,
            dob: dob,
            // 1 for Male, 2 for Female, 3 for Transgender
            gender : gender,
            medical_precondition_code: medical_precondition_code,
            other_vaccine_taken: other_vaccine_taken,
            other_vaccine_name: other_vaccine_name,
            other_vaccination_date: other_vaccination_date
        });

        emit VolunteerAdded(volunteer);
    }


      function isValidVolunteer(address volunteer) public view returns (bool) {
        return volunteers[volunteer].doesExist && volunteers[volunteer].isApproved;
    }

    function _approveVolunteer1(address volunteer) internal {
        volunteers[volunteer].isApproved = true;
        emit VolunteerApproved(volunteer);
    }

    function doesVolunteerExist(address volunteer) internal view returns (bool) {
        return volunteers[volunteer].doesExist;
    }
}




/**
 * @title The Vaccine CLinical Trials contract
 */
contract VaccineTrial is Ownable, Volunteers {

    address private _owner;
    address private _VaccineManufacturer;
    string SAEID;  
    bool SAEComplete;  
    bool SAEResolved;
    bool MonitoringCompleted;
    address private _Regulator;
    
    
   
    uint public NumberOfDose;
    uint public total_valid_volunteers;
    uint public total_partially_vaccinated;
    uint public total_fully_vaccinated;
    uint public total_adverse_results;
   uint public  total_cured_Volunteers;

    modifier onlyVaccineManufacturer {
        require(vaccineManufacturers[msg.sender].vaccineManufacturerState == _vaccineManufacturerState.Verified, "Only the VaccineManufacturer is allowed to perform action!");
        _;
    }

    modifier onlyValidClinic {
        require(clinics[msg.sender].clinicState == _clinicState.Verified, "Only an authorized clinic can do this!");
        _;
    }
    
    modifier onlyPI {
        require(pis[msg.sender].piState == _piState.Verified, "Only the Physical Investigator is allowed to perform the Physical Investigation");
        _;
    }

    modifier onlyRegulator() {
       require(msg.sender == owner, "Only the Regulator is allowed to perform action!");
      //  if (msg.sender == Regulator)
        _;
    //    else revert();
    }


    struct Clinics {
        address id;
        string name;
        string location;
        string phoneNumber;
        _clinicState clinicState;
    }
    
        struct VaccineManufacturers {
        address id;
        string name;
        uint    dose;
        _vaccineManufacturerState vaccineManufacturerState;
    }
    
        struct PIs {
        address id;
        string name;
        uint    piid;
        _piState piState;
    }
    

    struct Dose {
        uint dose_no;
        uint vaccinationDate;
        bool done;
    }

      struct VolunteerHealth {
        address id;
        string VolunteerFollowUp;
        string LabResult;
        bool SAEoccuredresult;
        bool SAEcuredstatus;
    }
    
    mapping (address => VolunteerHealth) volunteerHealth;

    mapping(address => Clinics) clinics;
    mapping(address => PIs) pis;
    mapping(address => VaccineManufacturers) vaccineManufacturers;
    mapping(address => uint) clinicRemovalRequest;
    // Mapping of each dose given
    mapping(uint => mapping(address => Dose)) doses;
    // Mapping for the dose result
    
    //event DoseGiven(address volunteer, uint doseNumber, uint remainingDaysForNextDose);
    event Clinic(address clinic, string eventName);
    event PI (address pi, string eventName);
    event VaccineManufacturer( address vaccineManufacturer, string eventName);
    event SAEupdated(address volunteer, string eventName);
    event Vacstatus (string message);

    event SAENotResolved(address volunteer,string eventName);
    enum _clinicState { NotVerified, Verified, NotFunctional }
    enum _piState { NotVerified, Verified, NotFunctional }
    enum _vaccineManufacturerState { NotVerified, Verified, NotFunctional}
    //enum _volunteerState { NotVerified, Verified, InTrial, NotInTrial, CompletedTrial }

   /* constructor (address VaccineManufacturer, uint numberOfDoses) {
       _owner = msg.sender;
       _VaccineManufacturer = VaccineManufacturer;
       NumberOfDose = numberOfDoses;
    }*/



   function enrollVaccineManufacturer (string memory vaccineManufacturerName, uint noofdose) public returns (bool) {
        require(bytes(vaccineManufacturerName).length != 0, "Vaccine Manufacturer  name should not be empty.");
        VaccineManufacturers({
        id: msg.sender,
        name: vaccineManufacturerName,
        dose: noofdose,
        vaccineManufacturerState: _vaccineManufacturerState.NotVerified
        });
        NumberOfDose = noofdose;
        emit VaccineManufacturer(msg.sender, "Vaccine Manufacturer Enrollment request");
        return true;
    }

  function authoriseVaccineManufacturer (address vaccineManufactureraddress ) public onlyRegulator returns (bool) {
        require(vaccineManufacturers[vaccineManufactureraddress].vaccineManufacturerState != _vaccineManufacturerState.Verified, "Vaccine Manufacturer already verified.");
        vaccineManufacturers[vaccineManufactureraddress].vaccineManufacturerState = _vaccineManufacturerState.Verified;
        emit VaccineManufacturer(vaccineManufactureraddress, "Authorise Vaccine Manufacturer");
        return true;
    }

    function enrollClinic (string memory clinicName, string memory clinicLocation, string memory clinicPhoneNumber) public returns (bool) {
        require(msg.sender != _owner && msg.sender != _VaccineManufacturer, "You can not enroll for clinic.");
        require(bytes(clinicName).length != 0, "clinic name should not be empty.");
        require(bytes(clinicLocation).length != 0, "clinic location should not be empty.");
        require(bytes(clinicPhoneNumber).length != 0, "clinic phone number should not be empty.");
        Clinics({
        id: msg.sender,
        name: clinicName,
        location: clinicLocation,
        phoneNumber: clinicPhoneNumber,
        clinicState: _clinicState.NotVerified
        });
        emit Clinic(msg.sender, "ClinicEnrollmentrequest");
        return true;
    }

    function authoriseClinic (address clinicAddress) public onlyVaccineManufacturer returns (bool) {
        require(clinics[clinicAddress].clinicState != _clinicState.Verified, "Clinic already verified.");
        clinics[clinicAddress].clinicState = _clinicState.Verified;
        emit Clinic(clinicAddress, "AuthoriseClinic");
        return true;
    }
    
   function enrollPI (string memory piname, uint piregid) public returns (bool) {
        require(bytes(piname).length != 0, "Physical Investigator name should not be empty.");
        PIs({
        id: msg.sender,
        name: piname,
        piid: piregid,
        piState: _piState.NotVerified
        });
        emit PI(msg.sender, "PIEnrollmentrequest");
        return true;
    }

  function authorisePI (address piaddress ) public onlyRegulator returns (bool) {
        require(pis[piaddress].piState != _piState.Verified, "Physical Investigator already verified.");
        pis[piaddress].piState = _piState.Verified;
        emit PI(piaddress, "AuthorisePI");
        return true;
    }
 


    

    function approveVolunteer(address volunteer) public onlyValidClinic {
        require(doesVolunteerExist(volunteer), "Volunteer doesn't exist");
        _approveVolunteer1(volunteer);
        total_valid_volunteers++;
    }



    function markVaccinationDone(address volunteer, uint dose_no) public onlyValidClinic {

        require(isValidVolunteer(volunteer), "Not a valid volunteer");
        require(dose_no <= NumberOfDose, "Invalid dose number ");

        if (dose_no > 1) {
            require(doses[dose_no-1][volunteer].done, "Last dose was not administered!");
        }
        if (dose_no == NumberOfDose) {
            require(doses[dose_no][volunteer].done ==false, "Vaccination Already Completed");
           
        }

        doses[dose_no][volunteer] = Dose({
        dose_no: dose_no,
        vaccinationDate: block.timestamp,
        done: true
        });

        if (dose_no == NumberOfDose) {
            total_fully_vaccinated++;
            emit Vacstatus("Fully Vaccinated, thanks for your paticipation!");
            total_partially_vaccinated--;
        } else if (dose_no < NumberOfDose) {
            total_partially_vaccinated++;
            volunteerHealth[volunteer].SAEoccuredresult = false;
            emit Vacstatus("Partially Vaccinated, thanks for your paticipation. Please complete Full Vaccination!");
        }
    }

    
      function MonitoringStage (address volunteer, uint dose_no, bool _SAERecovered, bool _MonitoringCompleted, string memory _volunteerFollowup, string memory _LabResult) public onlyValidClinic {
    
        require(isValidVolunteer(volunteer), "Not a valid volunteer");
        require(dose_no >= 1, "Invalid dose number");
        require(volunteerHealth[volunteer].SAEoccuredresult);
        volunteerHealth[volunteer] = VolunteerHealth({
        id:volunteer,
        VolunteerFollowUp: _volunteerFollowup, 
        LabResult:_LabResult,
        SAEoccuredresult:true,
        SAEcuredstatus:_SAERecovered}); 
        MonitoringCompleted = _MonitoringCompleted;
        if(_SAERecovered)
            total_cured_Volunteers++;
            total_adverse_results--;
        emit SAENotResolved(volunteer, "SAEobservedbyPI"); 
     
   }
   
//SAE - Serious Adverse Event
  function SetSAEStage(address volunteer, uint dose_no, string memory _SAEID) public onlyPI  {
    require(isValidVolunteer(volunteer), "Not a valid volunteer");
    require(dose_no >= 1, "Invalid dose number");
    require(!volunteerHealth[volunteer].SAEoccuredresult);
    SAEID = _SAEID;
    volunteerHealth[volunteer].SAEoccuredresult =true; 
    emit SAEupdated(volunteer, "VolunteerSAEupdated"); 
    total_adverse_results++;
    }
    

        
     
}