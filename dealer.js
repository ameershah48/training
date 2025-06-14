var brandlist = new Array("Porsche", "Volkswagen", "Audi", "BMW");

var gameStats = {
    clientsServed: 0,
    carsSold: 0,
    totalAmount: 0
};

var carPrices = {
    "Porsche": 650000.00,
    "Volkswagen": 180000.00,
    "Audi": 300000.00,
    "BMW": 250000.00
};

function newClient() {
	var preference = Math.floor((Math.random() * 4));
	var time = Math.floor((Math.random() * 10000) + 1);
	var client = Math.floor((Math.random() * 10) + 1);

	$("#clients_queue").append('<div class="client client_' + client + '"><span class="preference">Client for ' + brandlist[preference] + '</span></div>');

	$(".client").draggable();

	setTimeout(function () {
		newClient();
	}, 500);
}



$("document").ready(function (e) {
	newClient();

	$(".place").droppable({
		drop: function (event, ui) {
			alert('dropped');
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
			// alert('dropped');
			// alert(carPrices.BMW)

			var isPurchased = confirm("Would you like to purchase the car?");
			
			if(isPurchased == true){
				gameStats.clientsServed++;
				gameStats.totalAmount = gameStats.totalAmount  + carPrices.Porsche;
				gameStats.carsSold++;
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
