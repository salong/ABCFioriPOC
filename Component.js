jQuery.sap.declare("EPMDemo.Component");
jQuery.sap.require("sap.m.routing.RouteMatchedHandler");

sap.ui.core.UIComponent.extend("EPMDemo.Component", {
	metadata : {
		"name" : "Master Detail Sample",
		"version" : "1.0",
		"includes" : [],
		"dependencies" : {
			"libs" : ["sap.m", "sap.ushell"],
			"components" : []
		},

		"config" : {
			"resourceBundle" : "i18n/i18n.properties",
			"titleResource" : "SHELL_TITLE",
			
			"serviceConfig" : {
				name: "ZGW100_00_EPM_SRV",
				serviceUrl: "/sap/opu/odata/sap/ZGW100_00_EPM_SRV/"
			}
		},

    routing: {
			config: {
				viewType : "XML",
				viewPath: "EPMDemo.view",  // common prefix
				targetAggregation: "detailPages",
				clearTarget: false
			},
			routes:
				[{
					pattern: "",
					name : "master", // name used for listening or navigating to this route
					view : "Master",
					viewLevel : 0,
					targetAggregation : "masterPages",
					preservePageInSplitContainer : true,
					targetControl: "fioriContent",
					subroutes : [
									{
										pattern : "Detail/{detailId}", // will be the url and from has to be provided in the data
										name : "detail",
										view : "Detail",
										viewLevel : 1,
										subroutes : [
										       {
														pattern : "detail/{detailId}/soId/{soId}",
														name : "lineItems",
														view : "LineItem",
														viewLevel : 2								    	   
										    	   
										       }
										             
										]
									}]
				}]

		}
	},

	init : function() {
		sap.ui.core.UIComponent.prototype.init.apply(this, arguments);

		this._oRouteMatchedHandler = new sap.m.routing.RouteMatchedHandler(this.getRouter());
		// this component should automatically initialize the router
		this.getRouter().initialize();
		
		var oServiceConfig = this.getMetadata().getConfig()["serviceConfig"];
		var sServiceUrl = oServiceConfig.serviceUrl;

		// always use absolute paths relative to our own component
		// (relative paths will fail if running in the Fiori Launchpad)
		var rootPath = jQuery.sap.getModulePath("EPMDemo");

		// if proxy needs to be used for local testing...
		var sProxyOn = jQuery.sap.getUriParameters().get("proxyOn");
		var bUseProxy = ("true" === sProxyOn);
		if (bUseProxy) {
			sServiceUrl = rootPath + "/proxy" + sServiceUrl;
		} 

		// start mock server if required
		var responderOn = jQuery.sap.getUriParameters().get("responderOn");
		var bUseMockData = ("true" === responderOn);
		// var bUseMockData = true;
		if (bUseMockData) {
			jQuery.sap.require("sap.ui.app.MockServer");
			var oMockServer = new sap.ui.app.MockServer({
				rootUri: sServiceUrl
			});
			oMockServer.simulate(rootPath + "/model/metadata.xml", rootPath + "/model/");
			oMockServer.start();

			var msg = "Running in demo mode with mock data."; // not translated because only for development scenario
			jQuery.sap.require("sap.m.MessageToast");
			sap.m.MessageToast.show(msg, {
				duration: 4000
			});
		}

		
		// set i18n model
		var i18nModel = new sap.ui.model.resource.ResourceModel({
			bundleUrl : rootPath + "/i18n/i18n.properties"
		});
		this.setModel(i18nModel, "i18n");
		
		
		// set data model
		var m = new sap.ui.model.odata.ODataModel(sServiceUrl, {json: true,loadMetadataAsync: true});
		this.setModel(m);
		

		// set device model
		var deviceModel = new sap.ui.model.json.JSONModel({
			isTouch : sap.ui.Device.support.touch,
			isNoTouch : !sap.ui.Device.support.touch,
			isPhone : jQuery.device.is.phone,
			isNoPhone : !jQuery.device.is.phone,
			listMode : (jQuery.device.is.phone) ? "None" : "SingleSelectMaster",
					listItemType : (jQuery.device.is.phone) ? "Active" : "Inactive"
		});
		deviceModel.setDefaultBindingMode("OneWay");
		this.setModel(deviceModel, "device");
	},

	/**
	 * Initialize the application
	 * 
	 * @returns {sap.ui.core.Control} the content
	 */
	createContent : function() {

		var oViewData = {
				component : this
		};
		return sap.ui.view({
			viewName : "EPMDemo.view.App",
			type : sap.ui.core.mvc.ViewType.XML,
			viewData : oViewData
		});
	}
});