sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
], function(Controller, JSONModel, MessageBox){
    "use strict";
    return Controller.extend("pro_login.controller.Create", {
        onInit(){
            this.oRouter=this.getOwnerComponent().getRouter();
            this.oRouter.getRoute("Details").attachPatternMatched(this._onEmpDetails, this);
            this.oRouter.getRoute("Details-edit").attachPatternMatched(this._onEmpEdit, this);
            this.oRouter.getRoute("Create").attachPatternMatched(this._createEmp, this);

            const uiModel=new JSONModel({
                editable:false,
                visible:false,
                pageTitle:"CreateEmployee",
                isCreate:true,
                empId:""
            });
            this.getView().setModel(uiModel, "ui");

            const oModel=new JSONModel({
                name:"",
                email:"",
                gender:-1,
                department:"",
                salary:0,
                reporting_to:"",
                reportingto_text:"",
                projects:[]
            });
            this.getView().setModel(oModel, "oCreate");

            var oDepModel=new JSONModel({
                departments:[
                    {key:"111", text:"Managing Director"},
                    {key:"345", text:"Technical Manager"},
                    {key:"456", text:"Functional Manager"},
                    {key:"678", text:"HR Manager"},
                    {key:"789", text:"HR Recruiter"},
                    {key:"123", text:"Technical consultant"},
                    {key:"234", text:"Functional consultant"},
                    {key:"222", text:"Admin"}
                ]
            });
            this.getView().setModel(oDepModel, "oDep");

            this._reportingMap={
                "123":{
                    key: "345",
                    text: "Technical Manager"
                },
                "234":{
                    key: "456",
                    text: "Functional Manager"
                },
                "789":{
                    key: "678",
                    text: "HR Manager"
                },
                "345":{
                    key: "111",
                    text: "Managing Director"
                },
                "456":{
                    key: "111",
                    text: "Managing Director"
                },
                "678":{
                    key: "111",
                    text: "Managing Director"
                },
                "222":{
                    key: "111",
                    text: "Managing Director"
                },
                "111":{
                    key: null,
                    text: null
                }
            };

            var proModel=new JSONModel({
                projects:[
                    {   
                        key:"101", text:"Employee Management System", 
                        desc:"A centralized application to manage employee records, roles, and reporting hierarchy. Improves HR efficiency and ensures accurate employee data.", 
                        type:"Technical"
                    },
                    {
                        key:"102", text:"Salary Calculation System", 
                        desc:"Calculates employee salaries based on role and attendance. Reduces manual salary calculation errors.", 
                        type:"Technical"
                    },
                    {
                        key:"103", text:"Leave Request Management", 
                        desc:"Allows employees to apply for leave online. Simplifies leave approval and tracking.", 
                        type:"Functional"
                    },
                    {
                        key:"104", text:"Project Assignment Tracker", 
                        desc:"Tracks which employees are working on which projects. Makes project allocation simple and clear.", 
                        type:"Functional"
                    }
                ]
            });
            this.getView().setModel(proModel, "oPro");
        },
        _onEmpDetails(oEvent){
            var id=oEvent.getParameter("arguments").id;
            var ui=this.getView().getModel("ui");
            ui.setProperty("/editable", false);
            ui.setProperty("/visible", true);
            ui.setProperty("/pageTitle", "Employee Details");
            ui.setProperty("/isCreate",false);
            ui.setProperty("/empId", id);

            this._loadEmpById(id);
        },
        _onEmpEdit(oEvent){
            var id=oEvent.getParameter("arguments").id;
            var ui=this.getView().getModel("ui");
            ui.setProperty("/editable", true);
            ui.setProperty("/visible", false);
            ui.setProperty("/pageTitle", "Edit Employee Details");
            ui.setProperty("/isCreate",false);
            ui.setProperty("/empId", id);

            this._loadEmpById(id);
        },
        _createEmp(oEvent){
            var ui=this.getView().getModel("ui");
            ui.setProperty("/editable", true);
            ui.setProperty("/visible", false);
            ui.setProperty("/pageTitle", "Create Employee");
            ui.setProperty("/isCreate",true);
        },
        _loadEmpById(id){
            var that=this;
            $.ajax({
                url:"http://localhost:8080/employee/"+id,
                method:"GET",
                dataType:"json",
                success:function(oData){
                    oData.gender= oData.gender === "M" ? 0:1;
                    var num=parseFloat(oData.salary);
                    oData.salary= num.toFixed(2)+" INR";

                    var oModel=that.getView().getModel("oCreate")
                    oModel.setData(oData);

                    var aProjects=that.getView().getModel("oPro").getProperty("/projects");
                    if(oData.projects){
                        oData.projects.forEach((p,index)=>{
                            var sKey=String(p.projectId);
                            var oProject=aProjects.find(p=>p.key===sKey);
                            if(oProject){
                                oModel.setProperty("/projects/"+index+"/projectDesc", oProject.desc);
                                oModel.setProperty("/projects/"+index+"/projectType", oProject.type);
                            }
                        });
                    }
                },
                error:function(err){
                    MessageBox.error("Employee not found");
                }
            })
        },
        onSalaryLiveChange(oEvent){
            var input=oEvent.getSource();
            var value=input.getValue();

            if(value=== "0"){
                MessageBox.warning("Employee Salary cannot be 0");
                input.setValue("");
            }
            if(value===""){
                MessageBox.warning("Employee Salary cannot be Empty");
            }
            if(!/^[0-9.]*$/.test(value)){
                input.setValue("");
                MessageBox.warning("Only numbers allowed");
            }
        },
        onSalaryChange(oEvent){
            var input=oEvent.getSource();
            var value=input.getValue().trim();
            if(!(value==="")){
                value=value.replace(/^0+/,"");
                input.setValue(value);

                var num=parseFloat(value);
                input.setValue(num.toFixed(2) + " INR");
            }
        },
        onDepChange(){
            var oModel=this.getView().getModel("oCreate")
            var oData=oModel.getData();
            var dep=oData.department;

            var map=this._reportingMap[dep] || {key: null, text: null};
            oModel.setProperty("/reporting_to", map.key);
            oModel.setProperty("/reportingto_text", map.text);
        },
        onProChange(oEvent){
            var oCombo=oEvent.getSource();
            var sKey=oCombo.getSelectedKey();
            var oCtx=oCombo.getBindingContext("oCreate");
            var sPath=oCtx.getPath();
            var oModel=oCtx.getModel();
            if(!sKey){
                oModel.setProperty(sPath + "/projectId", "");
                oModel.setProperty(sPath + "/projectName", "");
                oModel.setProperty(sPath + "/projectDesc", "");
                oModel.setProperty(sPath + "/projectType", "");
                return;
            }
            var aProjects=this.getView().getModel("oPro").getProperty("/projects");

            var selectedProjects=oModel.getProperty("/projects");
            var currentIndex=parseInt(sPath.split("/").pop());
            var duplicate=selectedProjects.some((p, index)=>{ //it is to remove the duplicate projects when user tries to enter
                return index !=currentIndex && String(p.projectId) ===sKey;
            });
            if(duplicate){
                MessageBox.warning("This Project is already in the List");
                selectedProjects.splice(currentIndex, 1); //It is removing the selected project comboBox
                oModel.setProperty("/projects",selectedProjects)
                return;
            }

            var oProject=aProjects.find(p=>p.key===sKey);
            oModel.setProperty(sPath+"/projectName", oProject.text);
            oModel.setProperty(sPath+"/projectDesc", oProject.desc);
            oModel.setProperty(sPath+"/projectType", oProject.type);
        },
        onAddRow(){
            var oModel=this.getView().getModel("oCreate");
            var aProjects=oModel.getProperty("/projects");
            if (!aProjects) {
                aProjects = [];
            }
            aProjects.push({
                projectId:"",
                projectName:"",
                projectDesc:"",
                projectType:""
            });
            oModel.setProperty("/projects", aProjects);
        },
        onDelRow(){
            var oTable=this.byId("projectDetails");
            var oModel=this.getView().getModel("oCreate");
            var aProjects=oModel.getProperty("/projects");
            var aSelectedItem=oTable.getSelectedItems();
            if(!aSelectedItem.length){
                MessageBox.warning("Please select at least one row to remove");
                return;
            }
            aSelectedItem
                .map(oItem=>{
                    return oItem.getBindingContext("oCreate").getPath();
                })
                .sort((a,b)=>{
                    return parseInt(b.split("/").pop())-parseInt(a.split("/").pop());
                })
                .forEach(sPath=>{
                    var index=parseInt(sPath.split("/").pop());
                    aProjects.splice(index,1);
                });
            oModel.setProperty("/projects", aProjects);
            oTable.removeSelections(true);
        },
        onSave(){
            var oData=this.getView().getModel("oCreate").getData();
            var sGender=oData.gender===0 ? "M" : (oData.gender===1 ? "F" : " ");

            var sSalary=String(oData.salary);
            sSalary=sSalary.replace("INR", "").trim();
            sSalary=parseInt(sSalary);
            var that=this;

            var aProjectIds=oData.projects
                .filter(aProject=>{
                    return aProject.projectId;
                })
                .map(aProject=>{
                    return{ 
                        projectId:Number(aProject.projectId)
                    };
                });

            var ui=this.getView().getModel("ui").getData();
            if(ui.isCreate){
                $.ajax({
                    url:"http://localhost:8080/createEmp",
                    method:"POST",
                    contentType:"application/json",
                    data:JSON.stringify({
                        name:oData.name,
                        email:oData.email,
                        gender:sGender,
                        department:oData.department,
                        salary:sSalary,
                        reporting_to:oData.reporting_to,
                        projects:aProjectIds
                    }),
                    success:function(response){
                        var id=response;
                        MessageBox.success("Employee Created Successfully", {
                            onClose:function(){
                                that.getView().getModel("oCreate").setData({
                                    name:"",
                                    email:"",
                                    gender:-1,
                                    department:"",
                                    salary:0,
                                    reporting_to:"",
                                    reportingto_text:"",
                                    projects:[]
                                });
                                that.oRouter.navTo("Details", {id:id});
                            }
                        });
                    },
                    error:function(err){
                        MessageBox.error(err.responseText);
                    }
                })
            }
            else{
                $.ajax({
                    url:"http://localhost:8080/updateEmp/"+ui.empId,
                    method:"POST",
                    contentType:"application/json",
                    data:JSON.stringify({
                        name:oData.name,
                        gender:sGender,
                        department:oData.department,
                        salary:sSalary,
                        reporting_to:oData.reporting_to,
                        projects:aProjectIds
                    }),
                    success:function(response){
                       var id=response;
                        MessageBox.success("Employee Updated Successfully", {
                            onClose:function(){
                                that.getView().getModel("oCreate").setData({
                                    name:"",
                                    email:"",
                                    gender:-1,
                                    department:"",
                                    salary:0,
                                    reporting_to:"",
                                    reportingto_text:"",
                                    projects:[]
                                });
                                that.oRouter.navTo("Details", {id:id});
                            }
                        });
                    },
                    error:function(err){
                        MessageBox.error(err.responseText);
                    }
                })
            }
        },
        onEdit(){
            var oData=this.getView().getModel("ui").getData();
            this.oRouter.navTo("Details-edit", {id:oData.empId});
        },
        onCancel(){
            var oData=this.getView().getModel("ui").getData();
            if(oData.isCreate && oData.editable){
                this.getView().getModel("oCreate").setData({
                    name:"",
                    email:"",
                    gender:-1,
                    department:"",
                    salary:0,
                    reporting_to:"",
                    reportingto_text:"",
                    projects:[]
                });
            }
            else if(oData.editable && !(oData.isCreate)){
                this.oRouter.navTo("Details", {id:oData.empId});
            }
            
        },
        onBack(){
            this.getView().getModel("oCreate").setData({
                name:"",
                email:"",
                gender:-1,
                department:"",
                salary:0,
                reporting_to:"",
                reportingto_text:"",
                projects:[]
            });
            this.oRouter.navTo("DisplayEmp");
        }
    })
})