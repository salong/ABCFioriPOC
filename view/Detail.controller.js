sap.ui.core.mvc.Controller.extend("EPMDemo.view.Detail", {

	onInit: function() {
		this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		this._oRouter.attachRouteMatched(this.handleRouteMatched, this);

	},

	handleRouteMatched: function(oEvent) {
		var oView = this.getView();

		// when detail navigation occurs, update the binding context		
		if (oEvent.getParameter("name") === "detail") {

			this._detailId = oEvent.getParameter("arguments").detailId;

			var sDetailIdPath = "/" + oEvent.getParameter("arguments").detailId;

			var context = new sap.ui.model.Context(oView.getModel(), sDetailIdPath);
			oView.setBindingContext(context);
		}

	},

	handleLineItemPress: function(oEvent) {
		var sPath = oEvent.oSource.getBindingContext().getPath();
		var soId = sPath.substr(sPath.lastIndexOf("/") + 1);
		this._oRouter.navTo("lineItems", {
			detailId: this._detailId,
			soId: soId
		});
	},

	handleLineItemViewChange: function(oEvent) {
		if (!this._oTableSort) {
			this._oTableSort = sap.ui.xmlfragment("EPMDemo.frag.Detail_TableSort", this);
			this.getView().addDependent(this._oTableSort);
		}

		this._oTableSort.open();

	},

	handleConfirm: function(oEvent) {

		var oView = this.getView();
		var oTable = oView.byId("soList");

		var mParams = oEvent.getParameters();
		var oBinding = oTable.getBinding("items");

		// apply sorter to binding
		// (grouping comes before sorting)
		var aSorters = [];
		var sPath = mParams.sortItem.getKey();
		var bDescending = mParams.sortDescending;
		aSorters.push(new sap.ui.model.Sorter(sPath, bDescending));

		//For an OData model it does this server side so this has to be implemented
		//For instance, if I sort on BuyerName & asc the following request will be called  
		// /BusinessPartners('0100000000')/ToSalesOrders?$skip=0&$top=10&$orderby=BuyerName%20asc
		oBinding.sort(aSorters);

	},

	handleNavButtonPress: function(oEvent) {
		var history = sap.ui.core.routing.History.getInstance();
		var url = sap.ui.core.UIComponent.getRouterFor(this).getURL("master", {});
		var direction = history.getDirection(url);
		if ("Backwards" === direction) {
			window.history.go(-1);
		} else {
			var replace = true; // otherwise we go backwards with a forward history
			this.navTo(route, data, replace);
		}
	}
});