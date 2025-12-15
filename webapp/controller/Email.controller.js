sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
], function(Controller, JSONModel, MessageBox){
    "use strict";
    return Controller.extend("pro_login.controller.Email", {
        onInit(){
            this.oRouter=this.getOwnerComponent().getRouter();

            var oModel=new JSONModel({
                email:"",
                firstName:""
            });
            this.getView().setModel(oModel, "forgot");
        },

        onSubmit(){
            var oData=this.getView().getModel("forgot").getData();
            var that=this;

            $.ajax({
                url:"http://localhost:8080/forgot",
                method:"POST",
                contentType:"application/json",
                data:JSON.stringify({
                    email:oData.email,
                    firstName:oData.firstName
                }),
                success:function(response){
                    that.getOwnerComponent().getModel("global").setProperty("/email", oData.email);
                    that.oRouter.navTo("Password");
                    that.getView().getModel("forgot").setProperty("/email", "");
                    that.getView().getModel("forgot").setProperty("/firstName", "");
                },
                error:function(err){
                    MessageBox.error(err.responseText);
                }
            })
        },

        onBack(){
            this.oRouter.navTo("Login");
            this.getView().getModel("forgot").setProperty("/email", "");
            this.getView().getModel("forgot").setProperty("/firstName", "");
        }
    })
})