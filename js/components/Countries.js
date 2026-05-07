//const divApp = document.querySelector("#countries")

class Country {
    constructor(country_name,country_code,country_capital){
    this.country_name = country_name
    this.country_code = country_code 
    this.country_capital = country_capital
    }

    static fromJson(json_object){
        const available_keys = Object.keys(json_object)
        const country = new Country()
        if(available_keys.indexOf('name') > -1) {
            country.country_name = json_object.name.common
        }
        if(available_keys.indexOf('cca2') > -1) {
            country.country_code = json_object.cca2
        }
        if(available_keys.indexOf('capital') > -1) {
            country.country_capital = json_object.capital[0]
        }
        return country
        }
       
    }

    /*let country_data = []
    fetch("https://restcountries.com/v3.1/all").then(
        response => {
            response.json().then( data => {
                country_data = display_results_data(data)
            })
        }
    )
    console.log(country_data)
    function display_results_data(data) {
                //const country_data = []
                for(let i=0;i<data.length;i++) {   
                    country_data.push(Country.fromJson(data[i]))
                }
                for(let i = 0; i < country_data.length-1; i++) {
                    for(let j = i+1; j < country_data.length; j++) {
                        if(country_data[i].country_name.localeCompare(country_data[j].country_name) > 0) {
                            const tmp = country_data[i]
                            country_data[i] = country_data[j]
                            country_data[j] = tmp 
                        }
                    }
                }
               /* console.log(country_data[45])
                divApp.innerHTML = nunjucks.render("countries.njk", {
                    "country_data": country_data
                })*/
     /*           return country_data

    }*/
   