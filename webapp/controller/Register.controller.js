sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function(Controller, JSONModel, MessageToast){
    "use strict";
    return Controller.extend("pro_login.controller.Register",{
        onInit(){
            this.oRouter=this.getOwnerComponent().getRouter();

            const oModel=new JSONModel({
                email:"",
                password:"",
                confirmPassword:"",
                firstName:"",
                lastName:""
            });
            this.getView().setModel(oModel, "register");
        },

        onSignUp(){
            var oData=this.getView().getModel("register").getData();

            $.ajax({
                url:"http://localhost:8080/register",
                method:"POST",
                contentType:"application/json",
                data:JSON.stringify({
                    email:oData.email,
                    password:oData.password,
                    confirmPassword:oData.confirmPassword,
                    firstName:oData.firstName,
                    lastName:oData.lastName
                }),
                success: function(response){
                    MessageToast.show(response);
                },
                error: function(err){
                    MessageToast.show(err.responseText);
                }
            })
        },

        onLogin(){
            this.oRouter.navTo("Login");
        }
    })
})