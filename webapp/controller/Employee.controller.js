sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function(Controller, JSONModel, MessageToast, MessageBox, Filter, FilterOperator){
    "use strict";
    return Controller.extend("pro_login.controller.Employee", {
        onInit(){
            this.oRouter=this.getOwnerComponent().getRouter();
            var that=this;

            var oModel=new JSONModel({
                name:"",
                dep:"",
                loc:""
            });
            that.getView().setModel(oModel, "oFilter");

            var oDepModel=new JSONModel({
                departments:[
                    {key:"MD", text:"Managing Director"},
                    {key:"Technical Manager", text:"Technical Manager"},
                    {key:"Functional Manager", text:"Functional Manager"},
                    {key:"HR Manager", text:"HR Manager"},
                    {key:"HR Recruiter", text:"HR Recruiter"},
                    {key:"Technical consultant", text:"Technical consultant"},
                    {key:"Functional consultant", text:"Functional consultant"},
                    {key:"Admin", text:"Admin"},
                    {key:"Sales", text:"Sales"}
                ]
            });
            this.getView().setModel(oDepModel, "oDep");

            $.ajax({
                url:"http://localhost:8080/employee",
                method:"GET",
                dataType:"json",
                success:function(data){
                    var oModel=new JSONModel(data);
                    that.getView().setModel(oModel, "oData");
                    MessageToast.show("Data Loaded");
                },
                error:function(err){
                    MessageBox.error("Failed to Load Data");
                    console.log(err);
                }
            })
        },
        onSearch(){
            var oFilter=this.getView().getModel("oFilter").getData();
            const aFilter=[];

            if(oFilter.name?.trim()){
                aFilter.push(new Filter("name", FilterOperator.Contains, oFilter.name));
            }
            if(oFilter.dep?.trim()){
                aFilter.push(new Filter("department", FilterOperator.Contains, oFilter.dep));
            }
            if(oFilter.loc?.trim()){
                aFilter.push(new Filter("location", FilterOperator.Contains, oFilter.loc));
            };

            const oTable=this.byId("employeeData");
            oTable.getBinding("items").filter(aFilter);
        },
        onClear(){
            this.getView().getModel("oFilter").setData({
                name:"",
                dep:"",
                loc:""
            });
            var oTable=this.byId("employeeData");
            oTable.getBinding("items").filter([]);
        },
        onBack(){
            // this.oRouter.navTo("Home");

            const id = localStorage.getItem("userId");
            const encoded = btoa(id);
            this.oRouter.navTo("Home", { userId: encoded },);
        },
        onCreate(){
            this.oRouter.navTo("Create");
        },
        onRowSelect(oEvent){
            var oItem=oEvent.getParameter("listItem");
            var oData=oItem.getBindingContext("oData").getObject();
            var id=oData.id;
            this.oRouter.navTo("Details",{id:id});
        }
    })
})