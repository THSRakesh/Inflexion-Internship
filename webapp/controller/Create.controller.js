sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function(Controller, JSONModel, MessageToast){
    "use strict";
    return Controller.extend("pro_login.controller.Create", {
        onInit(){
            this.oRouter=this.getOwnerComponent().getRouter();

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
        onSalaryLiveChange(oEvent){
            var input=oEvent.getSource();
            var value=input.getValue();

            if(value=== "0"){
                MessageToast.show("Employee Salary cannot be 0");
                input.setValue("");
            }
            if(value===""){
                MessageToast.show("Employee Salary cannot be Empty");
            }
            if(!/^[0-9.]*$/.test(value)){
                input.setValue("");
                sap.m.MessageToast.show("Only numbers allowed");
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
            console.log(sSalary);
            var that=this;

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
                    MessageToast.show(response, {
                        duration : 3000
                    });
                    that.getView().getModel("oCreate").setData({
                        name:"",
                        email:"",
                        gender:-1,
                        department:"",
                        salary:0,
                        reporting_to:"",
                        reportingto_text:""
                    });
                    setTimeout(function(){
                        that.oRouter.navTo("DisplayEmp");
                    }, 4000);
                },
                error:function(err){
                    MessageToast.show(err.responseText);
                }
            })
        },
        onCancel(){
            this.getView().getModel("oCreate").setData({
                name:"",
                email:"",
                gender:-1,
                department:"",
                salary:0,
                reporting_to:"",
                reportingto_text:""
            });
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