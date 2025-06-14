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

function newClient() {
	var preference = Math.floor((Math.random() * 4));
	var time = Math.floor((Math.random() * 10000) + 1);
	var client = Math.floor((Math.random() * 10) + 1);
	var brand = brandlist[preference];

	$("#clients_queue").append('<div class="client client_' + client + '" data-brand=' + brand + '><span class="preference">Client for ' + brand + '</span></div>');

	$(".client").draggable({
		containment: "#salon",
		revert: "invalid",
	});

	setTimeout(function () {
		newClient();
	}, 500);
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

			if (placeBrand == clientBrand) {
				client.detach();
				carPlace.append(client);
				client.css({'position': 'absolute', 'top': '10px', 'left': '10px'});
			} else {
				queueArea.prepend(client);
				client.css({'position': 'relative', 'top': '10px', 'left': '0px'});
			}
		}
	});

	$("#exit").droppable({
		drop: function (event, ui) {
			gameStats.clientsServed++;
			updateStats()
			$(ui.draggable).remove();
		}
	});

	$("#cashier").droppable({
		drop: function (event, ui) {
			var isPurchased = confirm("Would you like to purchase the car?");
			var client = $(ui.draggable);
			var carBrand = client.data('brand').toLowerCase();
			var carPrice = carPrices[carBrand];

			if(isPurchased == true){
				gameStats.clientsServed++;
				gameStats.carsSold++;
				gameStats.totalAmount = gameStats.totalAmount  + carPrice;
			} else {
				gameStats.clientsServed++;
			}
			
			updateStats()
			$(ui.draggable).remove();
		}
	});

	// $("#clients_served").text('hello dunia');
	// $("#cars_sold").text('0');
	// $("#amount").text('0');
});

function updateStats() {
	$("#clients_served").text(gameStats.clientsServed);
	$("#cars_sold").text(gameStats.carsSold);
	$("#amount").text(gameStats.totalAmount);
}
