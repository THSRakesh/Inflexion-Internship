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
                reportingto_text:""
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
            }
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

                    that.getView().getModel("oCreate").setData(oData);
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
        onSave(){
            var oData=this.getView().getModel("oCreate").getData();
            var sGender=oData.gender===0 ? "M" : (oData.gender===1 ? "F" : " ");

            var sSalary=String(oData.salary);
            sSalary=sSalary.replace("INR", "").trim();
            sSalary=parseInt(sSalary);
            var that=this;

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
                        reporting_to:oData.reporting_to
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
                                    reportingto_text:""
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
                        reporting_to:oData.reporting_to
                    }),
                    success:function(response){
                        // MessageToast.show(response);
                        MessageBox.success(response, {
                            onClose:function(){
                                that.getView().getModel("oCreate").setData({
                                    name:"",
                                    email:"",
                                    gender:-1,
                                    department:"",
                                    salary:0,
                                    reporting_to:"",
                                    reportingto_text:""
                                });
                                that.oRouter.navTo("DisplayEmp");
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
                    reportingto_text:""
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
                reportingto_text:""
            });
            this.oRouter.navTo("DisplayEmp");
        }
    })
})