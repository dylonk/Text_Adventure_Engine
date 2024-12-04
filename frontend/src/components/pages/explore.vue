<script setup>
import globalNavBar from '@/components/standardjs/navbar.vue'
function goToHome() {
      this.$router.push('/')
}
</script>
    
<template>
    <globalNavBar/>
    <form id="section-bar" action="placeholder" method="get">
        <input type="search" name="search-bar" placeholder="Search">
    </form>
        <div class="games-section">
            <div class="game">
                <div class="gametitle">Fake Game 1</div>
                <div class="gamepic"><img src="https://media.istockphoto.com/id/1396814518/vector/image-coming-soon-no-photo-no-thumbnail-image-available-vector-illustration.jpg?s=612x612&w=0&k=20&c=hnh2OZgQGhf0b46-J2z7aHbIWwq8HNlSDaNp2wn_iko=" alt="blank"></div>
            </div>
            <div class="game">
                <div class="gametitle">Fake Game 2</div>
                <div class="gamepic"><img src="https://media.istockphoto.com/id/1396814518/vector/image-coming-soon-no-photo-no-thumbnail-image-available-vector-illustration.jpg?s=612x612&w=0&k=20&c=hnh2OZgQGhf0b46-J2z7aHbIWwq8HNlSDaNp2wn_iko=" alt="blank"></div>
            </div>
            <div class="game">
                <div class="gametitle">Fake Game 3</div>
                <div class="gamepic"><img src="https://media.istockphoto.com/id/1396814518/vector/image-coming-soon-no-photo-no-thumbnail-image-available-vector-illustration.jpg?s=612x612&w=0&k=20&c=hnh2OZgQGhf0b46-J2z7aHbIWwq8HNlSDaNp2wn_iko=" alt="blank"></div>
            </div>
            <div class="game">
                <div class="gametitle">Fake Game 4</div>
                <div class="gamepic"><img src="https://media.istockphoto.com/id/1396814518/vector/image-coming-soon-no-photo-no-thumbnail-image-available-vector-illustration.jpg?s=612x612&w=0&k=20&c=hnh2OZgQGhf0b46-J2z7aHbIWwq8HNlSDaNp2wn_iko=" alt="blank"></div>
            </div>
            <div class="game">
                <div class="gametitle">Fake Game 5</div>
                <div class="gamepic"><img src="https://media.istockphoto.com/id/1396814518/vector/image-coming-soon-no-photo-no-thumbnail-image-available-vector-illustration.jpg?s=612x612&w=0&k=20&c=hnh2OZgQGhf0b46-J2z7aHbIWwq8HNlSDaNp2wn_iko=" alt="blank"></div>
            </div>
            <div class="game">
                <div class="gametitle">Fake Game 6</div>
                <div class="gamepic"><img src="https://media.istockphoto.com/id/1396814518/vector/image-coming-soon-no-photo-no-thumbnail-image-available-vector-illustration.jpg?s=612x612&w=0&k=20&c=hnh2OZgQGhf0b46-J2z7aHbIWwq8HNlSDaNp2wn_iko=" alt="blank"></div>
            </div>
            <div class="game">
                <div class="gametitle">Fake Game 7</div>
                <div class="gamepic"><img src="https://media.istockphoto.com/id/1396814518/vector/image-coming-soon-no-photo-no-thumbnail-image-available-vector-illustration.jpg?s=612x612&w=0&k=20&c=hnh2OZgQGhf0b46-J2z7aHbIWwq8HNlSDaNp2wn_iko=" alt="blank"></div>
            </div>
            <div class="game">
                <div class="gametitle">Fake Game 8</div>
                <div class="gamepic"><img src="https://media.istockphoto.com/id/1396814518/vector/image-coming-soon-no-photo-no-thumbnail-image-available-vector-illustration.jpg?s=612x612&w=0&k=20&c=hnh2OZgQGhf0b46-J2z7aHbIWwq8HNlSDaNp2wn_iko=" alt="blank"></div>
            </div>
            <div class="game">
                <div class="gametitle">Fake Game 9</div>
                <div class="gamepic"><img src="https://media.istockphoto.com/id/1396814518/vector/image-coming-soon-no-photo-no-thumbnail-image-available-vector-illustration.jpg?s=612x612&w=0&k=20&c=hnh2OZgQGhf0b46-J2z7aHbIWwq8HNlSDaNp2wn_iko=" alt="blank"></div>
            </div>
            <div class="game">
                <div class="gametitle">Fake Game 10</div>
                <div class="gamepic"><img src="https://media.istockphoto.com/id/1396814518/vector/image-coming-soon-no-photo-no-thumbnail-image-available-vector-illustration.jpg?s=612x612&w=0&k=20&c=hnh2OZgQGhf0b46-J2z7aHbIWwq8HNlSDaNp2wn_iko=" alt="blank"></div>
            </div>
            <div class="game">
                <div class="gametitle">Fake Game 11</div>
                <div class="gamepic"><img src="https://media.istockphoto.com/id/1396814518/vector/image-coming-soon-no-photo-no-thumbnail-image-available-vector-illustration.jpg?s=612x612&w=0&k=20&c=hnh2OZgQGhf0b46-J2z7aHbIWwq8HNlSDaNp2wn_iko=" alt="blank"></div>
            </div>
            <div class="game">
                <div class="gametitle">Fake Game 12</div>
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
    padding-top: 20px;
    padding-bottom: 20px;
    justify-content: center;
    font-size: 24px;
  }

  input[type=search] {
    border: 2px solid black;
    padding: 5px;
    width: 30%;
    text-align: center;
  }

    .games-section{
    justify-content: center;
    display:flex;
    flex-direction: row;
    flex-wrap:wrap;
    height:min-content;
    margin: 5px;
    }

  .game {
    display: flex;
    flex-direction: column;
    text-align: center;
    width: min-content;
    font-size: 24px;
    margin: 2px; 
  }

  .gametitle {
    border: 2px solid black;
    padding: 10px;
  }

  img {
    border: 2px solid black;
    height: auto;
    width: calc(100vw * 0.15);
    object-fit: contain;
  }
</style>
