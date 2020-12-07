const searchBtn = document.querySelector(".search");
const dateDeparture = document.querySelector("#dateDeparture");
const containerResults = document.querySelector(".container__results");

const cityFromSel = document.querySelector("#cityFrom");
const cityToSel = document.querySelector("#cityTo");
const selectFrom = document.querySelector(".select__from");
const selectTo = document.querySelector(".select__to");
searchBtn.addEventListener("click", async function () {
  const data = await Api();
  clearInput();

  generateMarkup(data);
});

const getAirportData = async function () {
  const response = await fetch("airports_codes.txt");
  const array = await response.text();
  const arr = array.split("\n");
  let codes = [];
  let names = [];
  for (let i = 0; i < arr.length; i++) {
    names.push(arr[i].slice(4, -5).trim());
    codes.push(arr[i].slice(0, 3));
  }
  codes.pop();
  names.pop();
  codes.shift();
  names.shift();
  const ArrayOfAirportsAndCities = { AirportCodes: codes, AirportName: names };
  return ArrayOfAirportsAndCities;
};
getAirportData();

function correctDate(str) {
  return str.split("-").reverse().join("/");
}
function clearInput() {
  containerResults.textContent = "";
}

const generateOptions = async function () {
  const data = await getAirportData();
  const codes = data.AirportCodes;
  const names = data.AirportName;

  for (let i = 0; i < codes.length; i++) {
    let element = document.createElement("option");
    element.textContent = names[i];
    element.setAttribute("value", codes[i]);
    selectFrom.appendChild(element);
    let element2 = document.createElement("option");
    element2.textContent = names[i];
    element2.setAttribute("value", codes[i]);
    selectTo.appendChild(element2);
  }
  console.log(selectTo, selectFrom);
};

generateOptions();
function generateMarkup(data) {
  const html = data
    .map((el) => {
      return ` <div class="airlineCard">
    <div class="airlineCard__item airlineCard__from">FROM <span>${el.cityFrom}</span></div>
    <div class="airlineCard__item airlineCard__to">TO <span>${el.cityTo}</span></div>
    <div class=" airlineCard__item airlineCard__dateDeparture">Departure date <span>${dateDeparture.value}</span></div>
    <div class=" airlineCard__item airlineCard__dateReturn">Return date <span>${dateReturn.value}</span></div>
    <div class=" airlineCard__item airlineCard__price">Price <span>${el.price}€</span></div>
</div>`;
    })
    .join();

  containerResults.insertAdjacentHTML("afterbegin", html);
}

const Api = async function () {
  try {
    const res = await fetch(
      ` https://api.skypicker.com/flights?flyFrom=${selectFrom.value}&to=${
        selectTo.value
      }&dateFrom=${correctDate(dateDeparture.value)}&dateTo=${correctDate(
        dateReturn.value
      )}&partner=picky&v=3`
    );

    const data = await res.json();
    const dataFlights = data.data;
    console.log(dataFlights);
    return dataFlights;
  } catch (error) {
    console.log(error);
  }
};

/*
//get the following deparutre list
const departureFrom = async function () {
  try {
    const res = await fetch(
      `http://api.aviationstack.com/v1/airports?access_key=1e76ffa50645901da2304a4f4acebfae`
    );

    const data = await res.json();
    console.log(data);
  } catch (error) {
    console.log(error);
  }
};
dataFlights.map((el) => console.log(el.cityFrom, el.cityTo, el.price));
window.addEventListener("load", departureFrom());
`arrival :  ${data.data[0].arrival.airport}   `,
        `departure : ${data.data[0].departure.airport}`
*/

// outputs the content of the text file
