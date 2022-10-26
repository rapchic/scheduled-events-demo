function smi(ticketIndex,ticketCount) {
  const options = {"ticket_index" : ticketIndex , "date_now": new Date(Date.now()), "ticket_count":ticketCount};
  console.dir(options);
  client.request.invoke("createSchedule", options).then(
    function (data) {
      console.log("Server method Request ID is: " + data.requestID);
      console.log("Schedule created 7 mins into the future");
      showNotification("success", "Successfully created a schedule 7 mins into the future");
    },
    function (err) {
      console.log(err);
      console.log("Request ID: " + err.requestID);
      console.log("error status: " + err.status);
      console.log("error message: " + err.message);
      showNotification("danger", "Unable to create new schedule for leftover tickets");
    });
}

async function createTicket() {
  const ticketURL = "https://<%= iparam.freshdesk_subdomain %>.freshdesk.com/api/v2/tickets";
    const ticketDetails = {
      email: "hellotoyou@email.com",
      subject: `Hey , First HELLO always inspires!`,
      priority: 1,
      description: " Weirdest Hello World ever !!",
      status: 2,
    };

    const options = {
      headers: {
        Authorization: "Basic <%= encode(iparam.freshdesk_api_key) %>",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ticketDetails),
      method: "POST",
    };
    let data = await client.request.post(ticketURL, options);
    console.info("Successfully created ticket in Freshdesk");
    return data;
}

simulate.addEventListener("click", createNTickets);

async function createNTickets() {
  index = 0;
  const data = await client.iparams.get("ticket_count");
  console.log(data.ticket_count);
  const ticketCount= data.ticket_count;
  try{
  for (;index <=ticketCount ; index++) {
    await createTicket();
    console.log("processed req :" + index);
  }
} catch(err){
  console.error("Error: Failed to create a ticket");
  console.error(err);
  if (err.status == 429) {
    console.log("Exceeded API Rate Limit");
    smi(index, ticketCount);
  }
}
}

function showNotification(type, message) {
  return client.interface.trigger("showNotify", {
    type: type,
    message: message,
  });
}

function showBanner(value) {
  document.getElementById("newTicketBanner").value = value;
}

function onAppActivate() {
  client.data.get("loggedInUser").then(
    function (data) {
      window.agent = data.loggedInUser.contact.name;
      document.getElementById("agentName").textContent = `Hello ${agent},`;
      // document
      //   .getElementById("btnSayHello")
      //   .addEventListener("fwClick", sayHello);
    },
    function (error) {
      console.error("Error: Failed to fetch loggedInUser details");
      console.error(error);
    }
  );
}

document.onreadystatechange = function () {
  if (document.readyState === "interactive") renderApp();

  function renderApp() {
    var onInit = app.initialized();

    onInit.then(getClient).catch(function (error) {
      console.error("Error: Failed to initialize the app");
      console.error(error);
    });

    function getClient(_client) {
      window.client = _client;
      client.events.on("app.activated", onAppActivate);
    }
  }
};