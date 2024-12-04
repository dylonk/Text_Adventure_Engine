<script setup>
import globalNavBar from '@/components/standardjs/navbar.vue'
function goToHome() {
      this.$router.push('/')
}
</script>


<template>
    <globalNavBar/>
      <div id="section-bar">
            <div class="main">Main Page</div>
            <div class="op1">Other Page 1</div>
            <div class="op2">Other Page 2</div>
        </div>
            <div class="games-section">
                <div class="game">
                    <div class="gametitle">Fake Game 1-1</div>
                    <div class="gamepic"><img src="https://media.istockphoto.com/id/1396814518/vector/image-coming-soon-no-photo-no-thumbnail-image-available-vector-illustration.jpg?s=612x612&w=0&k=20&c=hnh2OZgQGhf0b46-J2z7aHbIWwq8HNlSDaNp2wn_iko=" alt="blank"></div>
                </div>
                <div class="game">
                    <div class="gametitle">Fake Game 1-2</div>
                    <div class="gamepic"><img src="https://media.istockphoto.com/id/1396814518/vector/image-coming-soon-no-photo-no-thumbnail-image-available-vector-illustration.jpg?s=612x612&w=0&k=20&c=hnh2OZgQGhf0b46-J2z7aHbIWwq8HNlSDaNp2wn_iko=" alt="blank"></div>
                </div>
                <div class="game">
                    <div class="gametitle">Fake Game 1-3</div>
                    <div class="gamepic"><img src="https://media.istockphoto.com/id/1396814518/vector/image-coming-soon-no-photo-no-thumbnail-image-available-vector-illustration.jpg?s=612x612&w=0&k=20&c=hnh2OZgQGhf0b46-J2z7aHbIWwq8HNlSDaNp2wn_iko=" alt="blank"></div>
                </div>
                <div class="game">
                    <div class="gametitle">Fake Game 1-4</div>
                    <div class="gamepic"><img src="https://media.istockphoto.com/id/1396814518/vector/image-coming-soon-no-photo-no-thumbnail-image-available-vector-illustration.jpg?s=612x612&w=0&k=20&c=hnh2OZgQGhf0b46-J2z7aHbIWwq8HNlSDaNp2wn_iko=" alt="blank"></div>
                </div>
                <div class="game">
                    <div class="gametitle">Fake Game 1-5</div>
                    <div class="gamepic"><img src="https://media.istockphoto.com/id/1396814518/vector/image-coming-soon-no-photo-no-thumbnail-image-available-vector-illustration.jpg?s=612x612&w=0&k=20&c=hnh2OZgQGhf0b46-J2z7aHbIWwq8HNlSDaNp2wn_iko=" alt="blank"></div>
                </div>
              </div>
              <div class="games-section">
                <div class="game">
                    <div class="gametitle">Fake Game 2-1</div>
                    <div class="gamepic"><img src="https://media.istockphoto.com/id/1396814518/vector/image-coming-soon-no-photo-no-thumbnail-image-available-vector-illustration.jpg?s=612x612&w=0&k=20&c=hnh2OZgQGhf0b46-J2z7aHbIWwq8HNlSDaNp2wn_iko=" alt="blank"></div>
                </div>
                <div class="game">
                    <div class="gametitle">Fake Game 2-2</div>
                    <div class="gamepic"><img src="https://media.istockphoto.com/id/1396814518/vector/image-coming-soon-no-photo-no-thumbnail-image-available-vector-illustration.jpg?s=612x612&w=0&k=20&c=hnh2OZgQGhf0b46-J2z7aHbIWwq8HNlSDaNp2wn_iko=" alt="blank"></div>
                </div>
                <div class="game">
                    <div class="gametitle">Fake Game 2-3</div>
                    <div class="gamepic"><img src="https://media.istockphoto.com/id/1396814518/vector/image-coming-soon-no-photo-no-thumbnail-image-available-vector-illustration.jpg?s=612x612&w=0&k=20&c=hnh2OZgQGhf0b46-J2z7aHbIWwq8HNlSDaNp2wn_iko=" alt="blank"></div>
                </div>
                <div class="game">
                    <div class="gametitle">Fake Game 2-4</div>
                    <div class="gamepic"><img src="https://media.istockphoto.com/id/1396814518/vector/image-coming-soon-no-photo-no-thumbnail-image-available-vector-illustration.jpg?s=612x612&w=0&k=20&c=hnh2OZgQGhf0b46-J2z7aHbIWwq8HNlSDaNp2wn_iko=" alt="blank"></div>
                </div>
                <div class="game">
                    <div class="gametitle">Fake Game 2-5</div>
                    <div class="gamepic"><img src="https://media.istockphoto.com/id/1396814518/vector/image-coming-soon-no-photo-no-thumbnail-image-available-vector-illustration.jpg?s=612x612&w=0&k=20&c=hnh2OZgQGhf0b46-J2z7aHbIWwq8HNlSDaNp2wn_iko=" alt="blank"></div>
                </div>
            </div>

</template>
<style scoped> 
#section-bar {
    position: relative;
    display: flex;
    flex-direction: row;
    border-bottom: 2px solid black;
    padding-left: 10%;
    padding-top: 15px;
    padding-bottom: 15px;
    justify-content: center;
    font-size: 24px;
  }

  .main {
    margin-right: 10%;
    border: 2px solid black;
    padding: 5px;
  }

  .op1 {
    margin-right: 10%;
    border: 2px solid black;
    padding: 5px;
  }

  .op2 {
    margin-right: 10%;
    border: 2px solid black;
    padding: 5px;
  }

  .games-section {
    position: relative;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: center;
    padding-left: 5%;
  }

  .game {
    display: flex;
    flex-direction: column;
    margin-top: 2%;
    margin-right: 5%;
    text-align: center;
    font-size: 24px;
  }

  .gametitle {
    border: 2px solid black;
    padding-top: 10px;
    padding-bottom: 10px;
  }

  img {
    border: 2px solid black;
    height: auto;
    width: calc(100vw * 0.15);
    object-fit: contain;
  }
</style>
