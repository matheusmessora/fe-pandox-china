$(document).ready(function() {
	onlyNumbers("#ddd");
	onlyNumbers("#p");
	$("#btnUser").click(validateUserForm);
	$("#btnPage").click(validatePageForm);

	clearStatusField("name");
	clearStatusField("description");
	clearStatusField("url");
	clearStatusField("mainColor");
	clearStatusField("img");
	clearStatusField("email");
	clearStatusField("password");
	clearStatusField("phone");
});

function clearStatusField(field) {
	$("#" + field).focus(function() {
		$("#" + field + "Div").removeClass("error");
		$("#" + field + "Help").html("");
	});
}
function onlyNumbers(id) {
	$(id).keypress(function(event) {
		if (event.which < 47 || event.which > 59) {
			event.preventDefault();
		}
	});
}

// Validador de Form Usuario
function validateUserForm() {
	var isValid = true;
	var value = $("#name").val();
	if (!value) {
		$("#nameDiv").addClass("error");
		$("#nameHelp").html("Nome inválido.");
		isValid = false;
	}

	value = $("#email").val();
	if (!value) {
		$("#emailDiv").addClass("error");
		$("#emailHelp").html("E-mail inválido.");
		isValid = false;
	}

	value = $("#password").val();
	if (!value) {
		$("#passwordDiv").addClass("error");
		$("#passwordHelp").html("Password inválido.");
		isValid = false;
	}

	if (false) {
		var ddd = $("#ddd").val();
		var phone = $("#phone").val();
		if (!ddd || !phone) {
			$("#phoneDiv").addClass("error");
			$("#phoneHelp").html("Telefone inválido.");
			isValid = false;
		}
	}

	if (isValid) {
		$("#userForm").submit();
	}
}




