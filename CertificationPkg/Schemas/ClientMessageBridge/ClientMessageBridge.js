define("ClientMessageBridge", ["ConfigurationConstants"],
	function(ConfigurationConstants) {
		return {
			// Сообщения.
			messages: {
				//Имя сообщения.
				"ReloadPageMessage": {
					// Тип сообщения — широковещательное, без указания конкретного подписчика.
					"mode": Terrasoft.MessageMode.BROADCAST,
					// Направление сообщения — публикация.
					"direction": Terrasoft.MessageDirectionType.PUBLISH
				}
			},
			methods: {
				// Инициализация схемы.
				init: function() {
					// Вызов родительского метода.
					this.callParent(arguments);
					// Добавление нового конфигурационного объекта в коллекцию конфигурационных объектов.
					this.addMessageConfig({
						// Имя сообщения, получаемого по WebSocket.
						sender: "ReloadPageMessage",
						// Имя сообщения с которым оно будет разослано внутри системы.
						messageName: "ReloadPageMessage"
					});
				},
				// Метод, выполняемый после публикации сообщения.
				afterPublishMessage: function(
					// Имя сообщения с которым оно было разослано внутри системы.
					sandboxMessageName,
					// Содержимое сообщения.
					webSocketBody,
					// Результат отправки сообщения.
					result,
					// Конфигурационный объект рассылки сообщения.
					publishConfig) {
					// Проверка, что сообщение соответствует добавленному в конфигурационный объект.
					if (sandboxMessageName === "ReloadPageMessage") {
						// Вывод содержимого в консоль браузера.
						window.console.info("Опубликовано сообщение: ReloadPageMessage");
					}
				}
			}
		};
	});