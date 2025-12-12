sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"

], function(Controller, JSONModel, MessageToast){
    "use strict";
    return Controller.extend("pro_login.controller.Login",{
        onInit(){
            this.oRouter=this.getOwnerComponent().getRouter();

            var oModel=new JSONModel({
                email:"",
                password:"",
            });
            this.getView().setModel(oModel, "login");
        },

        onLogin(){
            var oData=this.getView().getModel("login").getData();
            var that=this;

            $.ajax({
                url:"http://localhost:8080/login",
                method:"POST",
                contentType:"application/json",
                data:JSON.stringify({
                    email:oData.email,
                    password:oData.password
                }),
                success: function(response){
                    MessageToast.show(response.message);
                    const encodeId=btoa(response.userId.toString());
                    localStorage.setItem("isLoggedIn", "true");
                    localStorage.setItem("userId", encodeId);

                    that.oRouter.navTo("Home", { userId:encodeId });
                    
                    that.getView().getModel("login").setProperty("/password", "");
                },
                error: function(err){
                    MessageToast.show(err.responseText);
                }
            })
        },

        onForgot(){
            this.oRouter.navTo("Email");
            this.getView().getModel("login").setProperty("/password", "");
        },

        onRegister(){
            this.oRouter.navTo("Register");
            this.getView().getModel("login").setProperty("/password", "");
        }
    })
})