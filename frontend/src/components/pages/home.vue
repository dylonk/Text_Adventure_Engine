<script setup>
import { useRouter } from 'vue-router';
import globalNavBar from '@/components/standardjs/navbar.vue';
import clickSound from '@/assets/sounds/click.wav';
import moreSound from '@/assets/sounds/more.wav';
import explorer from'@/assets/Images/More.jpg';

const router = useRouter();

// Play sound function
function playClickSound(soundType = 'click') {
  const sound = new Audio(soundType === 'more' ? moreSound : clickSound);
  sound.volume = 0.5; // Adjust volume
  sound.play().catch((e) => console.warn("Sound play blocked", e));
}

// Navigate to explore page
function goToExplore() {
  playClickSound();
  router.push('/explore');
}

// Dummy data for popular games
const games = [
  { id: 1, title: 'Fake Game 1', image: 'https://i.pinimg.com/736x/13/34/75/133475f2b4de23314a01df9a61f85436.jpg' },
  { id: 2, title: 'Fake Game 2', image: 'https://i.pinimg.com/736x/13/34/75/133475f2b4de23314a01df9a61f85436.jpg' },
  { id: 3, title: 'Fake Game 3', image: 'https://i.pinimg.com/736x/13/34/75/133475f2b4de23314a01df9a61f85436.jpg' },
  { id: 4, title: 'Fake Game 4', image: 'https://i.pinimg.com/736x/13/34/75/133475f2b4de23314a01df9a61f85436.jpg' },
  { id: 5, title: 'Fake Game 5', image: 'https://i.pinimg.com/736x/13/34/75/133475f2b4de23314a01df9a61f85436.jpg' },
  { id: 6, title: 'More Games?', image: explorer}
];

function onGameClick(index) {
  playClickSound(index < 5 ? 'click' : 'more');
  if(index < 5)
    router.push({name: 'GamePage', params: { info: `testData${index}`} });
  else
    router.push({name: 'Explore'});
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
