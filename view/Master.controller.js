sap.ui.core.mvc.Controller.extend("EPMDemo.view.Master", {
	
	onInit : function () {
		
		this.oUpdateFinishedDeferred = jQuery.Deferred();

		this.getView().byId("list").attachEventOnce("updateFinished", function() {
			this.oUpdateFinishedDeferred.resolve();
		}, this);
		
		
		this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		this._oRouter.attachRouteMatched(this.handleRouteMatched, this);
		
	},
	
	handleRouteMatched : function(oEvent) {

		var oList = this.getView().byId("list");
		var sName = oEvent.getParameter("name");
		var oArguments = oEvent.getParameter("arguments");
		
		// Wait for the list to be loaded once
		jQuery.when(this.oUpdateFinishedDeferred).then(jQuery.proxy(function() {
			var aItems;

			// On the empty hash select the first item
			if (sName === "master") {
				this.selectDetail();
			}

			// Try to select the item in the list
			if (sName === "detail") {

				aItems = oList.getItems();
				for (var i = 0; i < aItems.length; i++) {
					if (aItems[i].getBindingContext().getPath() === "/" + oArguments.product) {
						oList.setSelectedItem(aItems[i], true);
						break;
					}
				}	
			}	

		}, this));
		
	},
	
	selectDetail : function() {
		if (!sap.ui.Device.system.phone) {
			var oList = this.getView().byId("list");
			var aItems = oList.getItems();
			if (aItems.length && !oList.getSelectedItem()) {
				oList.setSelectedItem(aItems[0], true);
				this.showDetail(aItems[0]);
			}
		}
	},

	
	handleSelect: function(oEvent) {
		var oListItem = oEvent.getParameter("listItem") || oEvent.getSource();
		
		// trigger routing to BindingPath of this ListItem - this will update the data on the detail page
		sap.ui.core.UIComponent.getRouterFor(this).navTo("detail",{from: "master", detailId: oListItem.getBindingContext().getPath().substr(1)});
	},
	
	showDetail : function(oItem) {
		// If we're on a phone, include nav in history; if not, don't.
		var bReplace = jQuery.device.is.phone ? false : true;
		sap.ui.core.UIComponent.getRouterFor(this).navTo("detail", {
			from: "master",
			detailId : oItem.getBindingContext().getPath().substr(1)
		}, bReplace);
	}
	
	
});	