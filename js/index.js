const input_text = document.getElementById("input_text")
const sumbit_button = document.getElementById("sumbit_button")
const user_image = document.getElementById("image")
const user_name = document.getElementById("name")
const user_blogAddr = document.getElementById("blog_addr")
const user_location = document.getElementById("location")
const user_bio = document.getElementById("bio")
const error = document.querySelector(".error")

// main function that sends request to server, restore data from local storage if input already saved, store data if not, and then show results
async function findMyGithub(e){
    let input = input_text.value;
    if(checkValidity(input)) {
        try {
            let response = await fetch(`https://api.github.com/users/${input}`);
            if (response.status != 200) {
                showError("There is no github account with this name!");
                return Promise.reject(`Request failed with error ${response.status}`);
            }
            let data = await JSON.parse(window.localStorage.getItem(input));
            if (data != null) {
                setValues(data);
                showSuccessful("Data successfully restored from Local Storage!")
            } else {
                error.style.display = "none";
                let obj = await response.json();
                setGithubAPI(obj);
                saveToLocalStorage(obj);
            }
        } catch (e) {
            console.log(e);
        }
    }
}

// show error if there was no repository with that account name, if not set appropriate  values from json 
function setGithubAPI(obj) {
    if (obj.length < 2) {
        showError("There is no repository with this account name!");
    } else {
        setValues(obj);
    }
}

// show answer to user
function setValues(obj){
    user_image.src = obj.avatar_url + "jpg";
    if (obj.name) {
        user_name.innerHTML = '<span> Name: ' + obj.name + '</span>';
    } else {
        putEmpty(user_name, 'Name');
    }
    if (obj.location){
        user_location.innerHTML = '<span> Location: '+ obj.location +'</span>';
    } else {
        putEmpty(user_location, 'Location');
    }
    if (obj.blog){
        user_blogAddr.innerHTML = '<span> Blog: '+ obj.blog +'</span>';
    } else {
        putEmpty(user_blogAddr, 'Blog');
    }
    if (obj.bio){
        user_bio.innerHTML ='<span> Bio: ' + getBio(obj.bio) + '</span>';
    } else {
        putEmpty(user_bio, 'Bio');
    }
}

// put empty instead of null (just to be more beautiful:))
function putEmpty(label, what){
    label.innerHTML = '<span>' + what + ': empty' + '</span>';
}

// split bio by "\r" and "\n" and put <br> to show newline in the html
function getBio(bio) {
    string = ""
    if (bio.includes("\r\n")){
        lines = bio.split("\r\n");
    } else if (bio.includes("\n")) {
        lines = bio.split("\n");        
    } else if (bio.includes("\r")) {
        lines = bio.split("\r");        
    } else {
        return bio;
    }

    for (let i=0; i < lines.length; i++){
        if (i != lines.length-1){
            string = string + lines[i] + " <br>"
        } else {
            string = string + lines[i]
        }
    } 
    return string;
}

// show error: guthub account not found
function showError(message) {
    user_image.src = "./images/whoisthis.jpg";
    user_name.innerHTML = '<span> Name: No One </span> ';
    user_location.innerHTML = '<span> Location: No one knows! </span>';
    user_blogAddr.innerHTML = '<span> Blog: https://IAmNotAnyOne.com </span>';
    user_bio.innerHTML = '<span> Bio: I don\'t know who am I either </span>';
    error.style.display = "block";
    error.style.border = "5px solid rgb(246, 106, 106)";

    error.innerHTML = "<span>" + message + "</span>";
    setTimeout(() => { 
        error.style.display = "none";
    }, 7000);
}

// show successful: 1. data stored to 2. or restored from local storage!
function showSuccessful(message){
    error.style.display = "block";
    error.innerHTML = "<span>" + message + "</span>";
    error.style.border= "5px solid rgb(7, 194, 14)";
    
    setTimeout(() => { 
        error.style.display = "none";
    }, 7000);
}

// check the validity of input text
function checkValidity(name) {
    const regex1 = /^[A-Za-z0-9]*$/g;
    const foundValid = name.match(regex1);
    if (foundValid.length > 0) {
        return true;
    }
}

// save input text to local storage
function saveToLocalStorage(obj){
    let name = input_text.value;
    if (checkValidity(name)) {
        window.localStorage.setItem(name, JSON.stringify(obj));
        showSuccessful("Data stored in local storage.");
    } else {
        showError("Can not Save!");
    }
}

// add event listener to the submit button to call the findMyGithub on click
sumbit_button.addEventListener('click', findMyGithub);

// clear storage after refreshing the page
window.localStorage.clear();
