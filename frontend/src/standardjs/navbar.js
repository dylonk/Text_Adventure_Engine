class NavBar extends HTMLElement{
    connectedCallback(){
        this.innerHTML =`

            <style>
            body{
                margin:0px;
            }
            .navbar{
                margin-top:0;
                position:sticky;
                width:100%;
                height:min-content;
                padding:10px 0px;
                background-color:darkgrey;
                min-height: max-content;
                font-family: Arial, Helvetica, sans-serif;
                font-weight:bold;
            }
            p.navbar>a{
                margin:5px;
                height:calc(min-content+10px);
            }

            p.navbar>a:link{
                color:white;
                text-decoration:none;

            }
            p.navbar>a:hover{
                background-color:grey;
            }
            </style>
            <p class="navbar">
                <a href="index.html" class="navbtn">Home</a>
                <a href="explore.html" class="navbtn">Explore</a>
                <a href="editor.html" class="navbtn">Create</a>
                <a href="profile.html" class="navbtn">My Profile</a>
                <a href="login.html" class="navbtn">Login/Register</a>
                <a href="about.html" class="navbtn">About</a>
            </p>
        `
    }
}

customElements.define('nav-bar',NavBar)