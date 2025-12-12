sap.ui.define([
  "sap/ui/core/ComponentContainer"
], function(ComponentContainer){
  "use strict";
  new ComponentContainer({
    name:"pro_login",
    settings:{
      id:"walkthrough"
    },
    async:true
  }).placeAt("content");
});