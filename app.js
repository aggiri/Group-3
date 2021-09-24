// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3 } from 'web3';
import { default as contract } from 'truffle-contract';

// Import our contract artifacts and turn them into usable abstractions.
import ct_artifacts from '../../build/contracts/VaccineTrial.json'

// Conference is our usable abstraction, which we'll use through the code below.
var CT = contract(ct_artifacts);

var accounts, account, speaker;
var sim;

function getBalance(address) {
    return web3.fromWei(web3.eth.getBalance(address).toNumber(), 'ether');
}

window.App = { //where to close
    start: function () {
        var self = this;

        web3.eth.getAccounts(function (err, accs) {
            if (err != null) {
                alert("There was an error fetching your accounts.");
                return;
            }

            if (accs.length == 0) {
                alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
                return;
            }
            accounts = accs;
            //$("#tentantAddress").html(getBalance(accounts[0])); //prints balance

            $("#tentantAddress").text(web3.eth.accounts[0]); //prints account address
            //console.log(accounts);

            self.initializeConference();
        });
    },

    initializeConference: function () {
        var self = this;

        CT.deployed().then(function (instance) {
            sim = instance;
            $("#confAddress").html(sim.address);

            self.checkValues();
        }).catch(function (e) {
            console.log(e);
        });

    },




    checkValues: function () {

        ct_artifacts.deployed().then(function (instance) {
            sim = instance;
            console.log(sim);
            //sim.tenant.call().then

            //( function(tent) { console.log(tent); $("input#tentantAddress").val(tent);  }). //})

            //catch(function(e) { console.log(e); });
        });
    },

    Submit: function (cn, cl, ci) {

        console.log(web3.eth.accounts[0], cn, cl, ci);
        var simp;
        CT.deployed().
            then(function (instance) {
                simp = instance;
                simp.enrollClinic(cn, cl, ci, { from: web3.eth.accounts[0], gas: 3000000 }).
                    then(function () { console.log(cn); console.log(cl); console.log(ci); console.log("'Transaction succesfull") });

                var solidityEvent = instance.allEvents({ fromBlock: 'latest', toBlock: 'latest' });
                solidityEvent.watch(function (err, result) {
                    if (err) {
                        console.log(err)
                    }
                    console.log(result)
                    if (result.args.eventName == "ClinicEnrollmentrequest") {
                        $("#i").html("Transaction submitted and Clinic Address is " + result.args.clinic + "");

                    }

                    // insert if statements to check which event has been caught
                });

            }).
            catch(function (e) { console.log(e); });

        /*then( function() { console.log(pr); console.log(ti);console.log(ra);console.log( JSON.stringify(SI) ); return simp.Principal.call(); }).
            then( function(Principal) { console.log(Principal);   return simp.Time.call();  }). //console.log(Time); 
            then( function(Time) { console.log(Time); return simp.Rate.call();}).
            then( function(Rate) { console.log(Rate); return simp.Interest.call(); }).
            then( function(Interest) { console.log(Interest);  $("#i").html(Interest.toNumber()); });  }). */

        //}); //})

    },

    vmSubmit: function (vm, nd) {

        console.log(web3.eth.accounts[0], vm, nd);
        var simp;
        CT.deployed().
            then(function (instance) {
                simp = instance;
                simp.enrollVaccineManufacturer(vm, nd, { from: web3.eth.accounts[0], gas: 3000000 }).
                    then(function () { console.log(cn); console.log(cl); console.log(ci); console.log("'Transaction succesfull") });

                var solidityEvent = instance.allEvents({ fromBlock: 'latest', toBlock: 'latest' });
                solidityEvent.watch(function (err, result) {
                    if (err) {
                        console.log(err)
                    }
                    console.log(result)
                    if (result.args.eventName == "Vaccine Manufacturer Enrollment request") {
                        $("#vmi").html("Transaction submitted and Vaccine Manufacturer Address is " + result.args.vaccineManufacturer + "");

                    }

                });
            }).
            catch(function (e) { console.log(e); });

    }, //vmSubmit Close

    vmaSubmit: function (vma) {

        console.log(web3.eth.accounts[0], vma);
        var simp;
        CT.deployed().
            then(function (instance) {
                simp = instance;
                simp.authoriseVaccineManufacturer(vma, { from: web3.eth.accounts[0], gas: 3000000 }).
                    then(function () { console.log(vma); console.log("'VM Authorisation succesfull") }).catch(function(e) {
                        console.log("txerror",e.message.split('"reason":')[1].split('},')[0]);
                       
                        $("#vmau").html("Transaction Failed due to  : " + e.message.split('"reason":')[1].split('},')[0] + "");
                    });

                var solidityEvent = instance.allEvents({ fromBlock: 'latest', toBlock: 'latest' });
                solidityEvent.watch(function (err, result) {
                    if (err) {
                        console.log(err)
                    }
                    console.log(result)
                    if (result.args.eventName == "Authorise Vaccine Manufacturer") {
                        $("#vmau").html("Transaction submitted and Vaccine Manufacturer Authorised is " + result.args.vaccineManufacturer + "");

                    }

                });
            }).
            catch(function (e) { console.log(e); });

    }, //vmaSubmit Close



    pieSubmit: function (piname, piid) {

        console.log(web3.eth.accounts[0], piname, piid);
        var simp;
        CT.deployed().
            then(function (instance) {
                simp = instance;
                simp.enrollPI(piname, piid, { from: web3.eth.accounts[0], gas: 3000000 }).
                    then(function () { console.log(piname); console.log(piid); console.log("'Transaction succesfull") });

                var solidityEvent = instance.allEvents({ fromBlock: 'latest', toBlock: 'latest' });
                solidityEvent.watch(function (err, result) {
                    if (err) {
                        console.log(err)
                    }
                    console.log(result)
                    if (result.args.eventName == "PIEnrollmentrequest") {
                        $("#piem").html("Transaction submitted and Physical Investigator Address is " + result.args.pi + "");

                    }

                });
            }).
            catch(function (e) { console.log(e); });

    }, //pieSubmit Close

    piaSubmit: function (pia) {

        console.log(web3.eth.accounts[0], pia);
        var simp;
        CT.deployed().
            then(function (instance) {
                simp = instance;
                simp.authorisePI(pia, { from: web3.eth.accounts[0], gas: 3000000 }).
                    then(function () { console.log(pia); console.log("'PI Authorisation succesfull") }).catch(function(e) {
                        console.log("txerror",e.message.split('"reason":')[1].split('},')[0]);
                       
                        $("#piau").html("Transaction Failed due to  : " + e.message.split('"reason":')[1].split('},')[0] + "");
                    });

                var solidityEvent = instance.allEvents({ fromBlock: 'latest', toBlock: 'latest' });
                solidityEvent.watch(function (err, result) {
                    if (err) {
                        console.log(err)
                    }
                    console.log(result)
                    if (result.args.eventName == "AuthorisePI") {
                        $("#piau").html("Transaction submitted and Physical Investigator Authorised is " + result.args.pi + "");

                    }

                });
            }).
            catch(function (e) { console.log(e); });

    }, //piaSubmit Close

    vlntrauthSubmit: function (vlntradd) {
        var showvln = false;
        console.log(web3.eth.accounts[0], vlntradd);
        var simp;
        CT.deployed().
            then(function (instance) {
                simp = instance;
                simp.approveVolunteer(vlntradd, { from: web3.eth.accounts[0], gas: 3000000 }).
                    then(function () {
                        showvln = true;
                        console.log(vlntradd); console.log("'Volunteer Authorisation succesfull") }).catch(function(e) {
                        console.log("txerror",e.message.split('"reason":')[1].split('},')[0]);
                       
                        $("#vlntrauth").html("Transaction Failed due to  : " + e.message.split('"reason":')[1].split('},')[0] + "");
                    });

                var solidityEvent = instance.VolunteerApproved({ fromBlock: 'latest', toBlock: 'latest' });
                solidityEvent.watch(function (err, result) {
                    if (err) {
                       console.log(err)
                                }
                    
                    console.log(result, " line 193", showvln)
                    if (showvln == true) {
                        $("#vlntrauth").html("Transaction submitted and Volunteer Authorised is " + result.args.volunteer + "");

                    }

                });
            }).
            catch(function (e) { console.log(e); });

    }, //vmaSubmit Close


    markvacSubmit: function (markvlntradd, doseno) {

        console.log(web3.eth.accounts[0], markvlntradd, doseno);
        var simp;
        CT.deployed().
            then(function (instance) {
                simp = instance;
                simp.markVaccinationDone(markvlntradd, doseno, { from: web3.eth.accounts[0], gas: 3000000 }).
                    then(function () { console.log(vlntradd); console.log(doseno); console.log("'Volunteer Vaccination") }).catch(function(e) {
                        console.log("txerror",e.message.split('"reason":')[1].split('},')[0]);
                       
                        $("#markvac").html("Transaction Failed due to  : " + e.message.split('"reason":')[1].split('},')[0] + "");
                    });

                var solidityEvent = instance.Vacstatus({ fromBlock: 'latest', toBlock: 'latest' });
                solidityEvent.watch(function (err, result) {
                    if (err) {
                        console.log(err)
                    }
                    console.log(result)
                    //if (result.args.eventName == "Volunteer Vaccinated") {
                        $("#markvac").html(result.args.message);

                    //}

                });
            }).
            catch(function (e) { console.log(e); });

    }, //markvacSubmit Close

    vlntreSubmit: function (dob,gen,mpc,ova,vn,vd) {
        console.log(web3.eth.accounts[0], dob,gen,mpc,ova,vn,vd);
        var simp;
        CT.deployed().
            then(function (instance) {
                simp = instance;
                simp.addVolunteer(dob,gen,mpc,ova,vn,vd, { from: web3.eth.accounts[0], gas: 3000000 }).
                    then(function () { console.log(dob); console.log(gen);console.log(mpc);console.log(ova);console.log(vn);console.log(vd); console.log("'Volunteer Add Transaction succesfull") }).catch(function(e) {
                      //  console.log("txerror",e.message.split('"reason":')[1].split('},')[0]);
                      console.log(e);
                        $("#vlntre").html("Transaction Failed due to  : " + e.message.split('"reason":')[1].split('},')[0] + "");
                    });

                var solidityEvent = instance.VolunteerAdded({ fromBlock: 'latest', toBlock: 'latest' });
                solidityEvent.watch(function (err, result) {
                    if (err) {
                        console.log(err)
                    }
                    console.log(result)
                   // if (result.args.eventName == "Volunteer Enrollment Process") {
                        $("#vlntre").html("Volunteer Added " + result.args.volunteer + "");

                //    }

                });
            }).
            catch(function (e) { console.log(e); });

    }, //volSubmit Close


    setsaeSubmit: function (vlntraddsae,dosenosae,saeid) {

        console.log(web3.eth.accounts[0], vlntraddsae,dosenosae,saeid);
        var simp;
        CT.deployed().
            then(function (instance) {
                simp = instance;
                simp.SetSAEStage(vlntraddsae,dosenosae,saeid, { from: web3.eth.accounts[0], gas: 3000000 }).
                    then(function () { console.log(vlntraddsae); console.log(dosenosae); console.log(saeid); console.log("'Volunteer SAE Status") }).catch(function(e) {
                        console.log("txerror",e.message.split('"reason":')[1].split('},')[0]);
                       
                        $("#setsae").html("Transaction Failed due to  : " + e.message.split('"reason":')[1].split('},')[0] + "");
                    });
               var solidityEvent = instance.allEvents({ fromBlock: 'latest', toBlock: 'latest' });
                solidityEvent.watch(function (err, result) {
                    if (err) {
                        console.log(err)
                    }
                    console.log(result)
                    if (result.args.eventName == "VolunteerSAEupdated") {
                        $("#setsae").html("SAE Status Recorded for Volunteer:  " + result.args.volunteer +"");
                    }

                  
                });
            }).
            catch(function (e) { console.log(e); });

    }, //setsaeSubmit Close


    monvolSubmit: function (vlntraddmonitor,dosenomonitor,issaerec,ismoncompl,volfollowup,labresult) {

        console.log(web3.eth.accounts[0], vlntraddmonitor,dosenomonitor,issaerec,ismoncompl,volfollowup,labresult);
        var simp;
        CT.deployed().
            then(function (instance) {
                simp = instance;
                simp.MonitoringStage(vlntraddmonitor,dosenomonitor,issaerec,ismoncompl,volfollowup,labresult, { from: web3.eth.accounts[0], gas: 3000000 }).
                    then(function () { console.log(vlntraddmonitor); console.log(dosenomonitor); console.log(issaerec);console.log(ismoncompl);console.log(volfollowup); console.log(labresult); console.log("'Volunteer SAE Status") }).catch(function(e) {
                        console.log("txerror",e.message.split('"reason":')[1].split('},')[0]);
                       
                        $("#monvolmsg").html("Transaction Failed due to  : " + e.message.split('"reason":')[1].split('},')[0] + "");
                    });

                var solidityEvent = instance.allEvents({ fromBlock: 'latest', toBlock: 'latest' });
                solidityEvent.watch(function (err, result) {
                    if (err) {
                        console.log(err)
                    }
                    console.log(result)
                    if (result.args.eventName == "SAEobservedbyPI") {
                        $("#monvolmsg").html("Clinic is monitoring the health status of volunteer:    "+result.args.volunteer + "  ");

                    }

                });
            }).
            catch(function (e) { console.log(e); });

    }, //monvolSubmit Close







    Publicdatasubmit: function () {
        console.log(web3.eth.accounts[0]);
        var simp;
        CT.deployed().
            then(function (instance) {
                simp = instance;

              /*  uint public total_valid_volunteers;
                uint public total_partially_vaccinated;
                uint public total_fully_vaccinated;
               uint public total_invalid_results;*/
               simp.total_partially_vaccinated.call().then( function (tpv) {
                $("#toparvac").html(tpv.toString())
                console.log(tpv)
             }); 
                simp.total_valid_volunteers.call().then( function (tvv) {
                    $("#tovalvol").html(tvv.toString())
                    console.log(tvv)
                 }); 
                 simp.NumberOfDose.call().then( function (nod) {
                    $("#noofdose").html(nod.toString())
                    console.log(nod)
                 }); 

                 simp.total_fully_vaccinated.call().then( function (tfv) {
                    $("#tovacc").html(tfv.toString())
                    console.log(tfv)
                 }); 
 
                 simp.total_adverse_results.call().then( function (tfv) {
                    $("#tovolaff").html(tfv.toString())
                    console.log(tfv)
                 }); 

                 simp.total_cured_Volunteers.call().then( function (tfv) {
                    $("#tovolcur").html(tfv.toString())
                    console.log(tfv)
                 }); 


                /*simp.addVolunteer(dob,gen,mpc,ova,vn,vd, { from: web3.eth.accounts[0], gas: 3000000 }).
                    then(function () { console.log(dob); console.log(gen);console.log(mpc);console.log(ova);console.log(vn);console.log(vd); console.log("'Volunteer Add Transaction succesfull") }).catch(function(e) {
                      //  console.log("txerror",e.message.split('"reason":')[1].split('},')[0]);
                      console.log(e);
                        $("#vlntre").html("Transaction Failed due to  : " + e.message.split('"reason":')[1].split('},')[0] + "");
                    });

                var solidityEvent = instance.VolunteerAdded({ fromBlock: 'latest', toBlock: 'latest' });
                solidityEvent.watch(function (err, result) {
                    if (err) {
                        console.log(err)
                    }
                    console.log(result)
                   // if (result.args.eventName == "Volunteer Enrollment Process") {
                        $("#vlntre").html("Volunteer Added " + result.args.volunteer + "");

                //    }

                });*/
            }).
            catch(function (e) { console.log(e); });

    }, //GetinfoSubmit Close



    

    cliaSubmit: function (clia) {

        console.log(web3.eth.accounts[0], clia);
        var simp;
        CT.deployed().
            then(function (instance) {
                simp = instance;
                simp.authoriseClinic(clia, { from: web3.eth.accounts[0], gas: 3000000 }).
                    then(function () { console.log(clia); console.log("'Clinic Authorisation succesfull") }).catch(function(e) {
                        console.log("txerror",e.message.split('"reason":')[1].split('},')[0]);
                       // console.log(e);
                       $("#cliau").html("Transaction Failed due to  : " + e.message.split('"reason":')[1].split('},')[0] + "");
                    });

                var solidityEvent = instance.allEvents({ fromBlock: 'latest', toBlock: 'latest' });
                solidityEvent.watch(function (err, result) {
                    if (err) {
                        console.log(err)
                    }
                    console.log(result)
                    if (result.args.eventName == "AuthoriseClinic") {
                        $("#cliau").html("Transaction submitted and Clinic Authorised is " + result.args.clinic + "");

                    }

                });
            }).
            catch(function (e) { console.log(e); });

    } //cliaSubmit Close

};//loop for main

window.addEventListener('load', async () => {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        try {
            // Request account access if needed
            await ethereum.enable();
            // Acccounts now exposed
            web3.eth.sendTransaction({/* ... */ });
        } catch (error) {
            // User denied account access...
        }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider);
        // Acccounts always exposed
        web3.eth.sendTransaction({/* ... */ });
    }
    // Non-dapp browsers...
    else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }

    CT.setProvider(web3.currentProvider);
    App.start();

    // Wire up the UI elements



    $("#submit").click(function () {
        var cn = $("#cn").val();
        var cl = $("#cl").val();
        var ci = $("#ci").val();
        App.Submit(cn, cl, ci);
    });


    $("#vmsubmit").click(function () {
        var vm = $("#vm").val();
        var nd = $("#nd").val();
       // var ci = $("#ci").val();
        App.vmSubmit(vm, nd);
    });

    $("#vmasubmit").click(function () {
        var vma = $("#vma").val();
               // var ci = $("#ci").val();
        App.vmaSubmit(vma);
    });


    $("#piesubmit").click(function () {
        var piname = $("#piname").val();
        var piid = $("#piid").val();
       // var ci = $("#ci").val();
        App.pieSubmit(piname, piid);
    });

    $("#piasubmit").click(function () {
        var pia = $("#pia").val();
               // var ci = $("#ci").val();
        App.piaSubmit(pia);
    });


    $("#cliasubmit").click(function () {
        var clia = $("#clia").val();
               // var ci = $("#ci").val();
        App.cliaSubmit(clia);
    });

    $("#vlntresubmit").click(function () {
        var dob = $("#dob").val();
        var gen = $("#gen").val();
        var mpc = $("#mpc").val();
        var ova = $("#ova").val();
        var vn = $("#vn").val();
        var vd = $("#vd").val();
        App.vlntreSubmit(dob,gen,mpc,ova,vn,vd);
    });

    $("#vlntrauthsubmit").click(function () {
        var vlntradd = $("#vlntradd").val();
        App.vlntrauthSubmit(vlntradd);
    });

    $("#markvacsubmit").click(function () {
        var markvlntradd = $("#markvlntradd").val();
        var doseno = $("#doseno").val();
        App.markvacSubmit(markvlntradd, doseno);
    });

    $("#setsaesubmit").click(function () {
        var vlntraddsae = $("#vlntraddsae").val();
        var dosenosae = $("#dosenosae").val();
        var saeid = $("#saeid").val();

        App.setsaeSubmit(vlntraddsae,dosenosae,saeid);
    });

    $("#monvolsubmit").click(function () {
        var vlntraddmonitor = $("#vlntraddmonitor").val();
        var dosenomonitor = $("#dosenomonitor").val();
        var issaerec= $("#issaerec").val();
        var ismoncompl= $("#ismoncompl").val();
        var volfollowup= $("#volfollowup").val();
        var labresult= $("#labresult").val();
        App.monvolSubmit(vlntraddmonitor,dosenomonitor,issaerec,ismoncompl,volfollowup,labresult);
    });


    $("#Publicdatasubmit").click(function () {
       
        App.Publicdatasubmit();
    });



  /*  $("#vlntrasubmit").click(function () {
        var vma = $("#clia").val();
               // var ci = $("#ci").val();
        App.vmaSubmit(clia);
    });*/
    //$("#trans").click(function() {
    //var val = $("#money").val();
    //  App.departure(val);
    //});

});