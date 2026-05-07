function login (username,password) {
    // AJAX ka serveru odakle bih dobio info ali i token / simulacija 
    if(username == "user" && password == "1234") {
        return {
            "name": "John Smith"
        }
    }
    return false
}

const API_KEY = (
    (globalThis.process && globalThis.process.env && globalThis.process.env.API_KEY)
    || globalThis.API_KEY
    || ""
).toString().trim()

function getApiKey() {
    if (!API_KEY) {
        window.alert("Missing API_KEY in environment.")
    }
    return API_KEY
}

const $divApp = $("#app") // staticki element, jquery objekat
const $body = $(document.body) // drugi element sa kojim cu da radim je body element koji cu da wrapujem kao jquery objekat, jquery dinamicki element (jquery nema bas dinanicke elemente, ali moze da prepoznaje dogadjaje koji su vezani za odredjeni element)
const $html = $("html")


nunjucks.configure("./templates", {autoescape: true})

if(sessionStorage.getItem("user_data") !== null) {
    $divApp.html(nunjucks.render("weather_data.njk"))
} else {
    $divApp.html(nunjucks.render("login.njk"))
} 
if (localStorage.getItem("theme") == null){
    localStorage.setItem("theme", "theme-light")
    localStorage.setItem("darkIsChecked", "")
}
if(localStorage.getItem("units")== null){
    localStorage.setItem("units", "imperial")
    localStorage.setItem("Symbol", " F ")
}
$html.addClass(localStorage.getItem("theme"))




$body.on("click", "#login_button", ()=> {
    const username = $("#login_username").val()
    const password = $("#login_password").val()
    const user_data = login(username,password)  // kredencijali, i pozivamo fungciju za login
    if(user_data == false) {
        $divApp.html(nunjucks.render("login.njk",
            {"error": " Invalid login credentials !"}
        ))
    } else {
        sessionStorage.setItem("user_data", JSON.stringify(user_data)) // kada je uspesno ulogovan, podatke sacuvamo u sessionStorage, pretvorimo string u objekat JSON.stringify(string), renerujemo stranu za ulogovanog korisnika !
        $divApp.html(nunjucks.render("weather_data.njk"))

        fetch("https://restcountries.com/v3.1/all").then(
            response => {
                response.json().then( data => {
                    country_data = display_results_data(data)
                })
            }
        ).catch((e) => {
            window.alert("REST failed!")
        })

        localStorage.setItem("choice", " F ")
        localStorage.setItem("Symbol", " K ")
        //localStorage.setItem("units", " imperial ")
    }
})

fetch("https://restcountries.com/v3.1/all").then(
    response => {
        response.json().then( data => {
            country_data = display_results_data(data)
        })
    }
)


function display_results_data(data) {
            const country_data = [{
                "country_name": "Select from list",
                "country_code": null,
                "country_capital": null
            }]
            for(let i=0;i<data.length;i++) {   
                country_data.push(Country.fromJson(data[i]))
            }
            for(let i = 1; i < country_data.length-1; i++) {
                for(let j = i+1; j < country_data.length; j++) {
                    if(country_data[i].country_name.localeCompare(country_data[j].country_name) > 0) {
                        const tmp = country_data[i]
                        country_data[i] = country_data[j]
                        country_data[j] = tmp 
                    }
                }
            }
            $divApp.html(nunjucks.render("weather_data.njk", {
                "country_data": country_data,
                "theme" : localStorage.getItem("darkIsChecked"),
                


            }))
            return country_data

}

function request () {
    city = $("#query_city").val()
    const country_code = $("#query_country").val()
    sessionStorage.setItem("city", city)
    sessionStorage.setItem("country", country_code)
    $units = localStorage.getItem("units")
    $Symbol = localStorage.getItem("Symbol")
    //console.log("name " + country_code)
    const $request = $.ajax(`https://api.openweathermap.org/data/2.5/weather?q=${city},${country_code}&appid=${getApiKey()}&units=${$units} `)
    return $request
}

$body.on('click', (e)=> {
    const $element = $(e.target)
    console.log($element)
    if ($element.attr("id") == "query_country"){
        $country = $('[class="cities"]:selected')
        let $city = $("#query_city")
        //console.log($country.attr("data-city"))
        $city.val($country.attr("data-city"))
        if($city.val() == $country.val()){
            $city.val($country.val())
            $country.val($country.val())
        }   
    }
    if($element.attr("id") == "dark_theme"){
        const $html = $("html")
        $html.removeClass()
      
        if($element.prop("checked")){
            console.log(" button dark_theme is checked !")
            localStorage.setItem("theme", "theme-dark")
            localStorage.setItem("darkIsChecked", "checked")
            $html.addClass(localStorage.getItem("theme"))
         

        } else {
           // localStorage.setItem("checkedDark", false)
            localStorage.setItem("theme", "theme-light")
            localStorage.setItem("darkIsChecked","")
            const $html = $("html")
            $html.addClass(localStorage.getItem("theme"))
           
        }


    }
    if($element.attr("id") == "unitsButton"){
        console.log(" button units is checked !")
        if($Symbol == "F"){
            $choice = "F"
            localStorage.setItem("choice", "F")
            localStorage.setItem("Symbol", "C")
            localStorage.setItem("units", "metric")
            $element.html("&deg;C")
            $(".symbol").html("&deg;F")
            city = $("#query_city").val()
            const country_code = $("#query_country").val()
            sessionStorage.setItem("city", city)
            sessionStorage.setItem("country", country_code)
            $units = localStorage.getItem("units")
            $Symbol = localStorage.getItem("Symbol")
            //console.log("name " + country_code)
            //const user_data = JSON.parse(sessionStorage.getItem("user_data"))
        
        
        const $request = request()
        $request.done((response_data)=> {
            $divApp.html(nunjucks.render("weather_data.njk", {
                "weather": response_data,
                "country_data": country_data,
                "theme" : localStorage.getItem("darkIsChecked"),
                "units": $units,
                "Symbol": $Symbol,
                "city": city,
                "choice": $choice
               
        
            })) 
        })
           
        
        
        } else{
            $choice = " C "
            localStorage.setItem("choice", "C")
            localStorage.setItem("Symbol", "F")
            localStorage.setItem("units", "imperial")
            $(".symbol").html("&deg;C")
            city = $("#query_city").val()
            const country_code = $("#query_country").val()
            sessionStorage.setItem("city", city)
            sessionStorage.setItem("country", country_code)
            $units = localStorage.getItem("units")
            $Symbol = localStorage.getItem("Symbol")
            //console.log("name " + country_code)
            
            
            const $request = $.ajax(`https://api.openweathermap.org/data/2.5/weather?q=${city},${country_code}&appid=${getApiKey()}&units=${$units} `)
            $request.done((response_data)=> {
            console.log("rd " +response_data)
                $divApp.html(nunjucks.render("weather_data.njk", {
                    "weather": response_data,
                    "country_data": country_data,
                    "theme" : localStorage.getItem("darkIsChecked"),
                    "units": $units,
                    "Symbol": $Symbol,
                    "city": city,
                    "choice": $choice,
                    "country": localStorage.getItem("country")
               
                }))
            
            })
        }

    }
    if(($element.attr("id") == "show_weather")){
       
        city = $("#query_city").val()
        const country_code = $("#query_country").val()
        sessionStorage.setItem("city", city)
        sessionStorage.setItem("country", country_code)
        $units = localStorage.getItem("units")
        $Symbol = localStorage.getItem("Symbol")
        $choice = localStorage.getItem("choice")
        //console.log("name " + country_code)
        
        
        const $request = $.ajax(`https://api.openweathermap.org/data/2.5/weather?q=${city},${country_code}&appid=${getApiKey()}&units=${$units} `)
        $request.done((response_data)=> {
        
            $divApp.html(nunjucks.render("weather_data.njk", {
                "weather": response_data,
                "country_data": country_data,
                "theme" : localStorage.getItem("darkIsChecked"),
                "units": $units,
                "Symbol": $Symbol,
                "city": city,
                "choice": $choice,
                "country": localStorage.getItem("country")
              
            }))
        
        })
    }

    
    if($element.hasClass("tab-button")){
        const tabButtons = document.querySelectorAll(".tab-button")
        const divTabContent = document.querySelector("#tab_content")
        for(let button of tabButtons) {
                const be = button.classList.remove("is-active")
                console.log("be"+be)
                const tab_id = e.target.getAttribute("data-tab")
                e.target.classList.add("is-active")
                divTabContent.animate(  
                [
                    {opacity: 0},
                    {opaity: 1}
                ],
                {
                    duration: 300,
                },)

                const file_name = "data_" + tab_id + ".njk"
                const $request = request()
                $request.done((response_data)=> {
                    divTabContent.innerHTML = nunjucks.render(file_name, {
                        "weather": response_data,
                        "units": localStorage.getItem("units")
                    })
                })

        }
    }
    if($element.attr("id") == "logout"){
        localStorage.clear()
        sessionStorage.clear()
        $html.removeClass()
        $divApp.html(nunjucks.render("login.njk"))
    }
    

})

// https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key} //
