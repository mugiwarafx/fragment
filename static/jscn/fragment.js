/*
##########################################################################
*
*   Copyright © 2019-2021 Akashdeep Dhar <t0xic0der@fedoraproject.org>
*
*   This program is free software: you can redistribute it and/or modify
*   it under the terms of the GNU General Public License as published by
*   the Free Software Foundation, either version 3 of the License, or
*   (at your option) any later version.
*
*   This program is distributed in the hope that it will be useful,
*   but WITHOUT ANY WARRANTY; without even the implied warranty of
*   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*   GNU General Public License for more details.
*
*   You should have received a copy of the GNU General Public License
*   along with this program.  If not, see <https://www.gnu.org/licenses/>.
*
##########################################################################
*/

async function populate_channel_list() {
  document.getElementById("listchan-uols").innerHTML = "";
  document.getElementById("chanhead").innerHTML = "Loading...";
  document.getElementById("chanfoot").innerHTML = `
        <span class="spinner-border spinner-border-sm mt-2" role="status" aria-hidden="true"></span>
    `;
  await $.getJSON(
    "/fragedpt/",
    {
      rqstdata: "listchan",
    },
    function (data) {
      for (let indx in data) {
        $("#listchan-uols").append(`
                <li class="list-group-item list-group-item-action" 
                    type="button" 
                    data-bs-toggle="modal" 
                    data-bs-dismiss="modal" 
                    data-bs-target="#datemode" 
                    onclick="populate_datetxt_list('${indx}');">
                    <div class="head h4">${indx}</div>
                    <div class="body small">
                        <span class="fw-bold">Source: </span>
                        <a href="${data[indx]}" target="_blank">${data[indx]}</a>
                    </div>
                </li>
            `);
      }
      document.getElementById("chanhead").innerHTML = "Channels";
      document.getElementById("chanfoot").innerHTML =
        "Pick a channel of your choice";
    }
  );
  // Creates search bar once list is populated
  document
    .getElementById("chanhead")
    .parentElement.insertAdjacentHTML(
      "afterend",
      `<input id="search-bar" type="text" placeholder="Search..">`
    );
  // Search bar logic
  $("#search-bar").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    var value = $(this).val().toLowerCase();
    $("#listchan-uols *").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  });
}

async function populate_datetxt_list(channel) {
  document.getElementById("listdate-uols").innerHTML = "";
  document.getElementById("datehead").innerHTML = "Loading...";
  document.getElementById("datefoot").innerHTML = `
        <span class="spinner-border spinner-border-sm mt-2" role="status" aria-hidden="true"></span>
    `;
  await $.getJSON(
    "/fragedpt/",
    {
      rqstdata: "listdate",
      channame: channel,
    },
    function (data) {
      const dataSorted = Object.entries(data);
      dataSorted.reverse();
      for (let i = 0; i < dataSorted.length; i++) {
        const element = dataSorted[i];
        const date = element[0];
        const url = element[1];
        $("#listdate-uols").append(`
                <li class="list-group-item list-group-item-action" 
                    type="button" 
                    data-bs-toggle="modal" 
                    data-bs-dismiss="modal" 
                    data-bs-target="#meetmode" 
                    onclick="populate_meeting_list('${channel}', '${date}');">
                    <div class="head h4">${date}</div>
                    <div class="body small">
                        <span class="fw-bold">Source: </span>
                        <a href="${url}" target="_blank">${url}</a>
                    </div>
                </li>
            `);
      }
      document.getElementById("datehead").innerHTML =
        "Meeting dates for " + channel;
      document.getElementById("datefoot").innerHTML =
        "Pick a date of your choice";
    }
  );
}

async function populate_meeting_list(channel, datetxt) {
  document.getElementById("listmeet-uols").innerHTML = "";
  document.getElementById("meethead").innerHTML = "Loading...";
  document.getElementById("meetfoot").innerHTML = `
        <span class="spinner-border spinner-border-sm mt-2" role="status" aria-hidden="true"></span>
    `;
  await $.getJSON(
    "/fragedpt/",
    {
      rqstdata: "listmeet",
      channame: channel,
      datename: datetxt,
    },
    function (data) {
      const dataSorted = Object.entries(data);
      dataSorted.forEach((element) => {
        const date_char_starts = element[0].search(/[1-9]/i);
        const string_date = element[0].substr(date_char_starts, 16);
        const string_date_with_commas = string_date.replace(/-|\./g, ",");
        const array_date = string_date_with_commas.split(",");
        const ready_to_format_date = array_date.map(Number);
        const date = new Date(...ready_to_format_date);
        element[2] = date;
      });
      dataSorted.sort(function (a, b) {
        return b[2] - a[2];
      });
      for (let i = 0; i < dataSorted.length; i++) {
        const element = dataSorted[i];
        const element_id = element[0];
        const logs_link = element[1].logs_link;
        const summary_link = element[1].summary_link;
        $("#listmeet-uols").append(`
            <li class="list-group-item list-group-item-action" 
                type="button" 
                data-bs-toggle="modal" 
                data-bs-dismiss="modal" 
                data-bs-target="#mainmode" 
                onclick="render_meeting_logs_and_summary('${element_id}', '${logs_link}', '${summary_link}');">
                <div class="head h4">
                    ${element_id}
                </div>
                <div class="body small">
                    <span class="fw-bold">Logs: </span>
                    <a href="${logs_link}" target="_blank">${logs_link}</a>
                </div>
                <div class="body small">
                    <span class="fw-bold">Summary: </span>
                    <a href="${summary_link}" target="_blank">${summary_link}</a>
                </div>
            </li>
        `);
      }
      document.getElementById("meethead").innerHTML =
        "Meetings on " + datetxt + " for " + channel;
      document.getElementById("meetfoot").innerHTML =
        "Pick a meeting of your choice";
    }
  );
}

async function populate_recent_meeting_list() {
  document.getElementById("listrcnt-daya-uols").innerHTML = "";
  document.getElementById("listrcnt-week-uols").innerHTML = "";
  document.getElementById("listrcnt-mont-uols").innerHTML = "";
  document.getElementById("none-daya").innerHTML = "";
  document.getElementById("none-week").innerHTML = "";
  document.getElementById("none-mont").innerHTML = "";
  document.getElementById("rcnthead").innerHTML = "Loading...";
  await $.getJSON(
    "/fragedpt/",
    {
      rqstdata: "rcntlsdy",
    },
    function (data) {
      populate_recent_meeting_on_dom(data, "daya");
    }
  );
  await $.getJSON(
    "/fragedpt/",
    {
      rqstdata: "rcntlswk",
    },
    function (data) {
      populate_recent_meeting_on_dom(data, "week");
    }
  );
  await $.getJSON(
    "/fragedpt/",
    {
      rqstdata: "rcntlsmt",
    },
    function (data) {
      populate_recent_meeting_on_dom(data, "mont");
    }
  );
  document.getElementById("rcnthead").innerHTML = "Recent conversations";
}

function populate_recent_meeting_on_dom(data, tabtitle) {
  if (JSON.stringify(data) === JSON.stringify({})) {
    document.getElementById("none-" + tabtitle).innerHTML = `
            <div class="text-center mt-4">
                <i class="display-1 fas fa-comment-slash"></i>
            </div>
            <div class="h4 head text-center mt-2 mb-2">
                Seems like everyone's keeping quiet
            </div>
            <div class="small text-center mb-4">
                Please come back later to get more recent meetings
            </div>
        `;
  } else {
    for (let indx in data) {
      $("#listrcnt-" + tabtitle + "-uols").append(`
                <li class="list-group-item list-group-item-action" type="button">
                    <div class="head h4">${data[indx]["meeting_topic"]}</div>
                    <div class="fst-italic small">${data[indx]["time"]} on ${data[indx]["channel"]} channel</div>
                    <div>
                        <a class="btn btn-sm btn-outline-secondary" target="_blank" href="${data[indx]["url"]["summary"]}">View summary</a>
                        <a class="btn btn-sm btn-outline-secondary" target="_blank" href="${data[indx]["url"]["logs"]}">View logs</a>
                    </div>
                </li>
            `);
    }
  }
}

async function render_meeting_logs_and_summary(name, logslink, summlink) {
  document.getElementById("mainhead").innerHTML = "Loading...";
  document.getElementById("mainfoot").innerHTML = `
        <span class="spinner-border spinner-border-sm mt-2" role="status" aria-hidden="true"></span>
    `;
  document.getElementById("summ-cont").innerHTML = "";
  document.getElementById("logs-cont").innerHTML = "";
  document.getElementById("summ-qrcd").innerHTML = "";
  document.getElementById("logs-qrcd").innerHTML = "";
  await $.getJSON(
    "/fragedpt/",
    {
      rqstdata: "obtntext",
      meetname: name,
      summlink: summlink,
      logslink: logslink,
    },
    function (data) {
      new QRCode(document.getElementById("summ-qrcd"), {
        text: summlink,
        width: 320,
        height: 320,
        colorDark: "#008080",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
        logo: "/static/imgs/logoteal.png",
      });
      new QRCode(document.getElementById("logs-qrcd"), {
        text: logslink,
        width: 320,
        height: 320,
        colorDark: "#008080",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
        logo: "/static/imgs/logoteal.png",
      });
      document.getElementById("perm-summ-link").innerText = summlink;
      document.getElementById("perm-summ-link").setAttribute("href", summlink);
      document.getElementById("perm-logs-link").innerText = logslink;
      document.getElementById("perm-logs-link").setAttribute("href", logslink);
      document
        .getElementById("summ-butn")
        .setAttribute("href", data["summary_slug"]);
      document
        .getElementById("logs-butn")
        .setAttribute("href", data["logs_slug"]);
      document.getElementById("mainhead").innerText = name;
      document.getElementById("summ-cont").innerHTML = data["summary_markup"];
      document.getElementById("logs-cont").innerHTML = data["logs_markup"];
      document.getElementById("mainfoot").innerHTML = "";
    }
  );
}
