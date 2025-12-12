sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel"
], function(UIComponent, JSONModel){
    "use strict";
    return UIComponent.extend("pro_login.Component",{
        interfaces:["sap.ui.core.IAsyncContentCreation"],
        metadata:{
            manifest:"json"
        },

        init(){
            UIComponent.prototype.init.apply(this, arguments);
            
            var oModel=new JSONModel({
                email:""
            });
            this.setModel(oModel,"global");

            this.getRouter().initialize();
        }
    })
})