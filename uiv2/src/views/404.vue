<template>
    <div class="wrapper_404">
        <section class="page_404">
        <div class="container">
            <div class="row">
            <div class="col-sm-12 ">
                <div class="col-sm-10 col-sm-offset-1  text-center">
                <div class="four_zero_four_bg">
                    <h1 class="text-center ">404</h1>
        
                </div>
        
                <div class="contant_box_404 font-semibold">
                    <h3 class="h2">
                    Look like you're lost
                    </h3>
        
                    <p>the page you are looking for not avaible!</p>
                </div>
                </div>
            </div>
            </div>
        </div>
        </section>
    </div>
    <!-- <div class="flex h-screen items-center justify-center">
        <div class="text-center text-6xl font-black ">
            404 - Page Not Found
        </div>
    </div> -->
    <!-- <p class="text-center text-4xl font-semibold mt-8 italic underline text-blue-400"><router-link  to="/overview">Go Back</router-link></p> -->
</template>

<style scoped>

     .wrapper_404 {
         display: flex;
         flex-direction: column;
         min-width: 100vw;
         height: 100vh;
         justify-content: center;
      }

      .page_404 {
         width: 1028px;
         max-width: 1028px;
         padding: 40px 0;
         margin: 0 auto;
         background-color: var(--main-bg-color);
         font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
         text-align: center;
      }

      .four_zero_four_bg {
         background-image: url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif);
         height: 400px;
         background-position: center;
         background-repeat: no-repeat;
      }

      .four_zero_four_bg h1 {
         font-size: 80px;
      }

      .four_zero_four_bg h3 {
         font-size: 80px;
      }

      .link_404 {
         color: #fff !important;
         padding: 10px 20px;
         background: #39ac31;
         margin: 20px 0;
         display: inline-block;
      }
      .contant_box_404 {
         margin-top: -50px;
      }
</style>