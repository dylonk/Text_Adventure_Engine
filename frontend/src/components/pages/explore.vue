<script setup>
import globalNavBar from '@/components/standardjs/navbar.vue'

function goToExplore() {
      this.$router.push('/explore')
}
</script>
<template>
    <globalNavBar/>
    <form id="section-bar" action="placeholder" method="get">
        <input type="search" name="search-bar" placeholder="Search">
    </form>
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
    padding-left: 40%;
    padding-top: 10px;
    padding-bottom: 25px;
    font-size: 24px;
  }

  input[type=search] {
    border: 2px solid black;
    padding: 5px;
    width: 30%;
  }

    .games-section{
        justify-content: center;
        margin:5%;
        display:flex;
        flex-wrap:wrap;
        height:min-content;

    }

  .game {
    display: flex;
    flex-direction: column;
    margin:3%;
    text-align: center;
    width: min-content;
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
    width: 230px;
    object-fit: contain;
  }
</style>