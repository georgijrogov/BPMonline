define("IteSwimmingProgram1Page", ["ProcessModuleUtilities"], function(ProcessModuleUtilities) {
	return {
		entitySchemaName: "IteSwimmingProgram",
		attributes: {},
		messages: {
				//Имя сообщения.
				"ReloadPageMessage": {
					// Тип сообщения — широковещательное, без указания конкретного подписчика.
					"mode": Terrasoft.MessageMode.BROADCAST,
					// Направление сообщения — подписка.
					"direction": Terrasoft.MessageDirectionType.SUBSCRIBE
				}
			},
		modules: /**SCHEMA_MODULES*/{}/**SCHEMA_MODULES*/,
		details: /**SCHEMA_DETAILS*/{
			"Files": {
				"schemaName": "FileDetailV2",
				"entitySchemaName": "IteSwimmingProgramFile",
				"filter": {
					"masterColumn": "Id",
					"detailColumn": "IteSwimmingProgram"
				}
			},
			"IteSchema952f0e99Detail97c77f90": {
				"schemaName": "IteSchema952f0e99Detail",
				"entitySchemaName": "IteSwimmingLesson",
				"filter": {
					"detailColumn": "IteProgram",
					"masterColumn": "Id"
				}
			}
		}/**SCHEMA_DETAILS*/,
		businessRules: /**SCHEMA_BUSINESS_RULES*/{
			"IteResponsible": {
				"cb2b65d0-762c-4e44-b4cd-486d6b423c2e": {
					"uId": "cb2b65d0-762c-4e44-b4cd-486d6b423c2e",
					"enabled": true,
					"removed": false,
					"ruleType": 1,
					"baseAttributePatch": "Type",
					"comparisonType": 3,
					"autoClean": false,
					"autocomplete": false,
					"type": 0,
					"value": "60733efc-f36b-1410-a883-16d83cab0980",
					"dataValueType": 10
				}
			}
		}/**SCHEMA_BUSINESS_RULES*/,
		methods: {
			init: function() {
					// Вызов родительского метода init().
					this.callParent(arguments);
					// Подписка на прием сообщения NewUserSet.
					this.sandbox.subscribe("ReloadPageMessage", this.onReloadPageMessage, this);
				},
				// Обработчик события получения сообщения NewUserSet.
			onReloadPageMessage: function(args) {
					// Вывод содержимого в консоль браузера.
					window.console.info("Получено сообщение: ReloadPageMessage");
					this.updateDetail({
						detail: "IteSchema952f0e99Detail97c77f90",
						reloadAll: true
					});
				},
			asyncValidate: function(callback, scope) {
				this.callParent([function(response) {
					if (!this.validateResponse(response)) {
						return;
					}
					Terrasoft.chain(
						function(next) {
							this.validateSwimmingPrograms(function(response) {
								if (this.validateResponse(response)) {
									next();
								}
							}, this);
						},
						function(next) {
							callback.call(scope, response);
							next();
						}, this);
				}, this]);
			},
			validateSwimmingPrograms: function(callback, scope) {
				Terrasoft.SysSettings.querySysSettingsItem("MaxActiveDailyLessons", function(maxCount) {
					const idPeriodicity = "a815379d-f663-4d04-8a66-849b32c6f9e7";
					var frequency = this.get("ItePeriodicity");
					var active = this.get("IteIsActive");
					var result = {success: true};
					var ermsg = this.get("Resources.Strings.TooManyActiveDailyProgramCaption");
					if (frequency.displayValue !== "Ежедневно" || active === false){
						callback.call(scope || this, result);
						return;
					}
					var esq = Ext.create("Terrasoft.EntitySchemaQuery", { rootSchemaName: "IteSwimmingProgram" });
					esq.filters.addItem(esq.createColumnFilterWithParameter(Terrasoft.ComparisonType.EQUAL, 
						"ItePeriodicity.Id", idPeriodicity));
					esq.filters.addItem(esq.createColumnFilterWithParameter(Terrasoft.ComparisonType.EQUAL,
						"IteIsActive", true));
					esq.getEntityCollection(function(response) {
						if (response && response.collection && response.collection.getCount() >= maxCount){
							result.message = ermsg.replace("{0}", maxCount);
							result.success = false;
						}
						callback.call(scope || this, result);
					}, this);
				}, this);
			},
			onAddSomeSwimmingLessonsClick: function() {
				var swimmingProgramId = this.get("Id");
				// Объект, который будет передан в качестве аргумента в метод executeProcess().
				var args = {
					// Имя процесса, который необходимо запустить.
					sysProcessName: "IteSwimmingLessonsAddition",
					// Объект со значением входящего параметра ContactParameter для процесса CustomProcess.
					parameters: {
						ProcessSchemaSwimmingProgramId: swimmingProgramId
					}
				};
				// Запуск пользовательского бизнес-процесса.
				ProcessModuleUtilities.executeProcess(args);
			}
		},
		dataModels: /**SCHEMA_DATA_MODELS*/{}/**SCHEMA_DATA_MODELS*/,
		diff: /**SCHEMA_DIFF*/[
			{
				// Выполняется операция добавления элемента на страницу.
				"operation": "insert",
				// Мета-имя родительского контейнера, в который добавляется кнопка.
				"parentName": "LeftContainer",
				// Кнопка добавляется в коллекцию компонентов
				// родительского элемента.
				"propertyName": "items",
				// Мета-имя добавляемой кнопки.
				"name": "AddLessonsButton",
				// Свойства, передаваемые в конструктор компонента.
				"values": {
					// Тип добавляемого элемента — кнопка.
					"itemType": Terrasoft.ViewItemType.BUTTON,
					// Привязка заголовка кнопки к локализуемой строке схемы.
					"caption": {bindTo: "Resources.Strings.AddSomeSwimmingLessons"},
					// Привязка метода-обработчика нажатия кнопки.
					"click": {bindTo: "onAddSomeSwimmingLessonsClick"},
					// Стиль отображения кнопки.
					"style": Terrasoft.controls.ButtonEnums.style.GREEN,
				}
			},
			{
				"operation": "insert",
				"name": "IteName30a28320-b145-40bf-9498-1142b1a447fd",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 0,
						"layoutName": "ProfileContainer"
					},
					"bindTo": "IteName"
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "IteCode3f5f0c3c-00ba-4afe-a9e5-4127604d87f4",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 1,
						"layoutName": "ProfileContainer"
					},
					"bindTo": "IteCode"
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "ItePeriodicity329c77b5-ca55-42e1-baf0-b61f5e0a1913",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 2,
						"layoutName": "ProfileContainer"
					},
					"bindTo": "ItePeriodicity"
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 2
			},
			{
				"operation": "insert",
				"name": "IteResponsible1b4fa37b-fc2d-4e2d-847d-962230f9c44c",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 3,
						"layoutName": "ProfileContainer"
					},
					"bindTo": "IteResponsible"
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 3
			},
			{
				"operation": "insert",
				"name": "IteIsActiveee47707e-bf1c-4f02-b839-ffb32e9d73dc",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 4,
						"layoutName": "ProfileContainer"
					},
					"bindTo": "IteIsActive"
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 4
			},
			{
				"operation": "insert",
				"name": "IteComment8fd8b10e-68d1-453a-a614-53865b555f53",
				"values": {
					"layout": {
						"colSpan": 12,
						"rowSpan": 1,
						"column": 0,
						"row": 0,
						"layoutName": "Header"
					},
					"bindTo": "IteComment"
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "Tab78343efaTabLabel",
				"values": {
					"caption": {
						"bindTo": "Resources.Strings.Tab78343efaTabLabelTabCaption"
					},
					"items": [],
					"order": 0
				},
				"parentName": "Tabs",
				"propertyName": "tabs",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "IteSchema952f0e99Detail97c77f90",
				"values": {
					"itemType": 2,
					"markerValue": "added-detail"
				},
				"parentName": "Tab78343efaTabLabel",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "remove",
				"name": "ESNTab"
			},
			{
				"operation": "remove",
				"name": "ESNFeedContainer"
			},
			{
				"operation": "remove",
				"name": "ESNFeed"
			}
		]/**SCHEMA_DIFF*/
	};
});
