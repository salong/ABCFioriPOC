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

        this.createTreeTable();
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
	},
	
	createTreeTable : function() {
	    //Define some sample data 
        // var oData = {
        // 		root:{
        // 			name: "root",
        // 			description: "root description",
        // 			checked: false,
        // 			0: {
        // 				name: "item1",
        //     			description: "item1 description",
        //     			checked: true,
        // 				0: {
        // 					name: "subitem1-1",
        //         			description: "subitem1-1 description",
        //         			checked: true,
        // 					0: {
        // 						name: "subsubitem1-1-1",
        // 		        			description: "subsubitem1-1-1 description",
        // 		        			checked: true
        // 					},
        // 					1: {
        // 						name: "subsubitem1-1-2",
        // 		        			description: "subsubitem1-1-2 description",
        // 		        			checked: true
        // 					}
        // 				},
        // 				1: {
        // 					name: "subitem1-2",
        //         			description: "subitem1-2 description",
        // 		        		checked: true,
        // 					0: {
        // 						name: "subsubitem1-2-1",
        // 		        			description: "subsubitem1-2-1 description",
        // 		        			checked: true
        // 					}
        // 				}
        				
        // 			},
        // 			1:{
        // 				name: "item2",
        //     			description: "item2 description",
        //     			checked: true,
        // 				0: {
        // 					name: "subitem2-1",
        //         			description: "subitem2-1 description",
        //         			checked: true
        // 				}
        // 			},
        // 			2:{
        // 				name: "item3",
        //     			description: "item3 description",
        //     			checked: true
        // 			}
        			
        // 		}
        // };
        
        // for (var i = 0; i < 20; i++) {
        // 	oData["root"][2][i] = {
        // 		name: "subitem3-" + i,
        // 			description: "subitem3-" + i + " description",
        // 			checked: false
        // 	};
        // }
        
        // //Create an instance of the table control
        // var oTable = new sap.ui.table.TreeTable({
        // 	columns: [
        // 		new sap.ui.table.Column({label: "Name", template: "name"}),
        // 		new sap.ui.table.Column({label: "Description", template: "description"})
        // 	],
        // 	selectionMode: sap.ui.table.SelectionMode.Single,
        // 	enableColumnReordering: true,
        // 	expandFirstLevel: true,
        // 	toggleOpenState: function(oEvent) {
        // 		var iRowIndex = oEvent.getParameter("rowIndex");
        // 		var oRowContext = oEvent.getParameter("rowContext");
        // 		var bExpanded = oEvent.getParameter("expanded");
        // 		alert("rowIndex: " + iRowIndex + 
        // 				" - rowContext: " + oRowContext.getPath() + 
        // 				" - expanded? " + bExpanded);
        // 	}
        // });
        
        // //Create a model and bind the table rows to this model
        // var oModel = new sap.ui.model.json.JSONModel();
        // oModel.setData(oData);
        // oTable.setModel(oModel);
        // oTable.bindRows("/root");
        
        // //Button to demonstrate collapse and expand feature
        // var oBtn = new sap.ui.commons.Button({text: "Toggle",
        // 	press: function() {
        // 		var iSelectedIndex = oTable.getSelectedIndex();
        // 		if (iSelectedIndex > -1) {
        // 			if (oTable.isExpanded(iSelectedIndex)) {
        // 				oTable.collapse(iSelectedIndex);
        // 			} else {
        // 				oTable.expand(iSelectedIndex);
        // 			}
        // 		}
        // 	}
        // });
        // oTable.setToolbar(new sap.ui.commons.Toolbar({items: [oBtn]}));
        
        // //Bring the table onto the UI 
        // oTable.placeAt("sample1");
	}
});