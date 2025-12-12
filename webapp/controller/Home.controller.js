sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function(Controller){
    "use strict";
    return Controller.extend("pro_login.controller.Home",{
        onInit(){
            this.oRouter=this.getOwnerComponent().getRouter();
            this.oRouter.getRoute("Home").attachMatched(this._onRouteMatch, this);
        },
        _onRouteMatch:function(oEvent){
            let encodedId=oEvent.getParameter("arguments").userId;
            try{
                this.userId=atob(encodedId);
                // console.log("Decoded Id :", this.userId);
            }
            catch(e){
                console.warn("Invalid :", encodedId);
                this.userId=encodedId;
            }
        },
        
        onUsers(){
            this.oRouter.navTo("DisplayEmp")
        },

        onLogout(){
            this.oRouter.navTo("Login");
        }
    })
})