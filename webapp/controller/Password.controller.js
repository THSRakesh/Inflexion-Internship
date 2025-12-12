sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function(Controller, JSONModel, MessageToast){
    "use strict";
    return Controller.extend("pro_login.controller.Password", {
        onInit(){
            this.oRouter=this.getOwnerComponent().getRouter();

            var oModel=new JSONModel({
                password:"",
                confirmPassword:""
            });
            this.getView().setModel(oModel, "forgot");
        },
        onSubmit(){
            var oData=this.getView().getModel("forgot").getData();
            var oEmail=this.getOwnerComponent().getModel("global").getData();
            var that=this;

            $.ajax({
                url:"http://localhost:8080/changePassword",
                method:"POST",
                contentType:"application/json",
                data:JSON.stringify({
                    email:oEmail.email,
                    password:oData.password,
                    confirmPassword:oData.confirmPassword
                }),
                success:function(response){
                    sap.ui.core.BusyIndicator.show(0);
                    MessageToast.show(response, {
                        duration: 2000
                    });
                    setTimeout(()=>{
                        sap.ui.core.BusyIndicator.hide();
                        that.oRouter.navTo("Login")
                    }, 2000);
                    that.getView().getModel("global").setProperty("/email", "");
                    that.getView().getModel("forgot").setProperty("/password", "");
                    that.getView().getModel("forgot").setProperty("/confirmPassword", "");
                },
                error:function(err){
                    MessageToast.show(err.responseText);
                }
            })
        },
        onBack(){
            this.oRouter.navTo("Email");
            this.getView().getModel("global").setProperty("/email", "");
            this.getView().getModel("forgot").setProperty("/password", "");
            this.getView().getModel("forgot").setProperty("/confirmPassword", "");
        }
    })
})