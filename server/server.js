var requestPromise = require('request-promise');
var request = require('request');
var base64 = require('base-64');


async function createNTickets(args) {
  try{
    const ticketCount = args.data.ticket_count;
    const ticketLeft = ticketCount - args.data.ticket_index;
    for (i=0;i <=ticketLeft;i++){
      await createTicket(args);
      console.log("Ticket created");
    }
  } catch (error){
    console.log(error);
    console.error("Error: Failed to create a ticket, statusCode : " + error.status);
    if (error.status == 401) {
      console.log("invalid credentials");
    }
    else if (error.status == 429) {
      console.log("Exceeded API Rate Limit");
      try{
      let data = await $schedule.fetch({ name: "tickets_leftover-" + args.data.ticket_index})
      console.log(data);
      if (data.name == ("tickets_leftover-" + args.data.ticket_index)){
         console.log("Schedule with name : " + data.name + " already exists.Ignoring new schedule");
         return ;
       }
      } catch (err){
        console.log(err);
        if (err.status = 404){
        console.log("Schedule does not exist, will create a new one.");
        const options = {"ticket_index" : args.data.ticket_index , "date_now": new Date(Date.now()).toISOString(), "ticket_count": args.data.ticket_count}
        await createScheduleInternal(options);
        }
      }
    }
  }
}

async function createTicket(args) {
  console.log(args);
  console.log('Creating ticket');
  var options = {
    uri: `https://${args.domain}/api/v2/tickets`,
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic <%= encode(iparam.freshdesk_api_key) %>"
    },
    body: JSON.stringify({
      email: "hellotoyou@email.com",
      subject: `Hey, First HELLO always inspires!`,
      priority: 1,
      description: "Hello world description!!",
      status: 2,
    })
  }
  return $request.post(options.uri, options);
  
}

function getScheduledDate(date=new Date(Date.now())){
  const now = new Date(date);
  console.log("current date "+ now.toISOString());
  now.setMinutes(now.getMinutes() + 7);
  console.log("scheduled date " + now.toISOString());
  return now.toISOString();
}

async function checkIfScheduleExists(options){
  try{
    let data = await $schedule.fetch({ name: "tickets_leftover" + options.ticket_index});
    if (data.name == ("tickets_leftover-" + options.ticket_index)){
      console.log("Schedule with name : " + data.name + " already exists.Ignoring new schedule");
      return true ;
     }
    } catch (err){
      console.log("Schedule does not exist, will create a new one.");
      return false;
    }
}
async function createScheduleInternal(options){
  console.log(JSON.stringify(options));
  try{
    doesScheduleExist = await checkIfScheduleExists(options);
    if (doesScheduleExist){
      console.log("Schedule with name : " + options.name + " already exists.Ignoring new schedule");
      return ;
    }else{
      let data = await $schedule.create({
        name: "tickets_leftover-" + options.ticket_index,
        data: {
          ticket_index: options.ticket_index,
          ticket_count: options.ticket_count
        },
        schedule_at:  getScheduledDate(options.date_now)
      });
      console.log("Successfully created the schedule with name: "+ "tickets_leftover-" + options.ticket_index);
      return data;
    }
    } catch (err){
      console.log(err);
    }
}

exports = {
  createSchedule: async function (options){
   let data = await createScheduleInternal(options);
   renderData(data);
  },

  onScheduledEventHandler: async function (args) {
    await createNTickets(args);
  },

  onAppInstallCallback: function () {
    console.log("App is installing");
    renderData();

  }

}