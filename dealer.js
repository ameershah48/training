var brandlist = new Array("Porsche", "Volkswagen", "Audi", "BMW");

var gameStats = {
	clientsServed: 0,
	carsSold: 0,
	totalAmount: 0
};

var carPrices = {
	"porsche": 650000.00,
	"volkswagen": 180000.00,
	"audi": 300000.00,
	"bmw": 250000.00
};

var placeOccupied = {
	"porsche": false,
	"volkswagen": false,
	"audi": false,
	"bmw": false
};

var carBrandStock = {
	"porsche": 4,
	"volkswagen": 6,
	"audi": 5,
	"bmw": 3
};

var clientCount = 0;

function newClient() {
	if (clientCount < 3) {
		var preference = Math.floor((Math.random() * 4));
		var time = Math.floor((Math.random() * 10000) + 1);
		var client = Math.floor((Math.random() * 10) + 1);
		var brand = brandlist[preference];

		var $newClient = $('<div class="client client_' + client + '" data-brand=' + brand + '><span class="preference">Client for ' + brand + '</span></div>');
		$("#clients_queue").append($newClient);

		$newClient.draggable({
			containment: "#salon",
			revert: "invalid",
		});
		clientCount++;
	}

	setTimeout(function () {
		newClient();
	}, time);
}

$("document").ready(function (e) {
	newClient();

	$(".place").droppable({
		drop: function (event, ui) {
			var client = $(ui.draggable);
			var carPlace = $(this);
			var queueArea = $("#clients_queue");

			var placeBrand = carPlace.data('brand').toLowerCase();
			var clientBrand = client.data('brand').toLowerCase();

			if (carBrandStock[clientBrand] <= 0) {
				removeClientToQueue(client, queueArea);
				alert("Cars is out of stock.")
				return;
			}

			if (placeOccupied[placeBrand] == true) {
				removeClientToQueue(client, queueArea);
				return;
			} else {
				placeOccupied[placeBrand] = true;
			}

			if (placeBrand == clientBrand) {
				client.detach();
				carPlace.append(client)
				client.css({ 'position': 'absolute', 'top': '10px', 'left': '10px' });
			} else {
				removeClientToQueue(client, queueArea)
			}
		}
	});

	$("#exit").droppable({
		drop: function (event, ui) {
			var client = $(ui.draggable);
			var carBrand = client.data('brand').toLowerCase();

			gameStats.clientsServed++;
			placeOccupied[carBrand] = false;

			updateStats()

			client.addClass('client-animation')

			setTimeout(() => {
				client.remove();
				clientCount--;
			}, 1000)
		}
	});

	$("#cashier").droppable({
		drop: function (event, ui) {
			var client = $(ui.draggable);
			var clientBrand = client.data('brand').toLowerCase();
			var carPrice = carPrices[clientBrand];
			var queueArea = $("#clients_queue");

			if (placeOccupied[clientBrand] == false) {
				removeClientToQueue(client, queueArea)
				return;
			}

			if (carBrandStock[clientBrand] <= 0) {
				removeClientToQueue(client, queueArea)
				alert("Cars is out of stock.")

				return;
			}

			var isPurchased = false;

			$("#dialog-confirm").dialog({
				resizable: false,
				height: "auto",
				width: 400,
				modal: true,
				buttons: {
					"Yes": function () {
						isPurchased = true;
						$(this).dialog("close");
					},
					"No": function () {
						$(this).dialog("close");
					}
				}, 
				close: function() {
					if (isPurchased == true) {
						gameStats.clientsServed++;
						gameStats.carsSold++;
						gameStats.totalAmount = gameStats.totalAmount + carPrice;
						carBrandStock[clientBrand]--;
					} else {
						gameStats.clientsServed++;
					}
		
					placeOccupied[clientBrand] = false;
		
					updateStats()
		
					client.addClass('client-animation')
		
					setTimeout(() => {
						client.remove();
						clientCount--;
					}, 1000)
				}
			});
		}
	});
});

function updateStats() {
	$("#clients_served").text(gameStats.clientsServed + " clients");
	$("#cars_sold").text(gameStats.carsSold + " cars");
	$("#amount").text("€ " + gameStats.totalAmount.toLocaleString('en-MY', { minimumFractionDigits: 2 }));

	updateSold();
}

function updateSold() {
	for (var brand in carBrandStock) {
		var placeElement = $(".place[data-brand='" + brand + "']");
		var carImages = placeElement.find(".car-image");
		var currentStock = carBrandStock[brand];

		carImages.each(function (index) {
			if ((index + 1) > currentStock) {
				$(this).attr("src", "images/Sold.jpg");
			}
		});
	}
}

function removeClientToQueue(client, queueArea) {
	queueArea.prepend(client);
	client.css({ 'position': 'relative', 'top': '10px', 'left': '0px' });
}