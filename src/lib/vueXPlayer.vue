<template>
  <div id="wrapper">
    <audio autoplay loop controls :src="url" ref="player" id="player"></audio>
    <div class="audioplayer" ref="playerWra" :style="{backgroundColor:bgColor,width:small?'2.5em':'100%'}" @mouseenter="small=false" @mouseleave="small=true">
      <div class="audioplayer-playpause" title="Play" @click="changePlayState">
        <a href="#">Play</a>
      </div>
      <transition name="fade">
        <div class="audioplayer-time audioplayer-time-current" v-show="!small">{{getPlayTime(current)}}</div>
      </transition>
      <transition name="fade">
        <div class="audioplayer-bar" ref="bar" v-show="!small">
          <!--<div class="audioplayer-bar-loaded" style="width: 22.2419%;"></div>&lt;!&ndash;加载进度&ndash;&gt;-->
          <div class="audioplayer-bar-played" :style="{width: current/duration*100+'%'}"></div> <!--播放进度-->
          <input type="range" v-model="range" step="0.1" @input="kk" ref="ranges" @mousedown="move=true">
        </div>
      </transition>
      <transition name="fade">
        <div class="audioplayer-time audioplayer-time-duration" v-show="!small">{{getPlayTime(duration)}}</div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  props:['url','bgColor','small'],
  data(){
    return{
      duration:0,
      current:0,
      move:false,
      range:0,
    }
  },
  mounted(){
    var player = this.$refs.player, bar = this.$refs.bar
    this.w = this.$refs.bar.offsetWidth
    this.listenStart(player)
    document.body.addEventListener('mouseup',()=>{
      if(this.move){
        this.move=false
        player.currentTime = this.duration*this.range/100
      }
    })
  },
  methods:{
    addClass(ele, cls) {
        ele.className += ' ' + cls;
    },
    removeClass(ele, cls) {
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');ele.className = ele.className.replace(reg, ' ');
    },
    changePlayState(){
      if(this.duration){
        if(this.$refs.player.paused){
          this.$refs.player.play()
          this.addClass(this.$refs.playerWra,'audioplayer-playing')
        }else {
          this.$refs.player.pause()
          this.removeClass(this.$refs.playerWra,'audioplayer-playing')
        }
      }
    },
    kk(){
      this.current = this.duration/100*this.range
    },
    listenStart(el){
      el.addEventListener('timeupdate', ()=>{
        if(this.duration&&!this.move){
          this.current = el.currentTime
          this.range = this.current/this.duration*100
        }else {
          this.isOn = true
          this.addClass(this.$refs.playerWra,'audioplayer-playing')
          this.duration = el.duration
        }
      })
    },
    getPlayTime(val){
      var tM = ~~(val / 60)
      var tS = Math.floor(val % 60)
      tS<10?tS=`0${tS}`:tS
      val = tM+':'+tS
      return val
    },
  },
}
</script>

<style scoped>
  #player{
    position: absolute;
    opacity: 0;
  }
  input[type='range']{
    top: -2px;
    position: absolute;
    opacity: 0;
    z-index: 9999;
    cursor: pointer;
    height: 14px;
    width: 100%;
  }
  .audioplayer
  {
    transition: width .2s;
    height: 2.5em;
    color: #fff;
    text-shadow: 1px 1px 0 #000;
    border: 1px solid #222;
    position: relative;
    z-index: 1;
    background: #333;
    background: linear-gradient( top, #444, #222 );
    -webkit-box-shadow: inset 0 1px 0 rgba( 255, 255, 255, .15 ), 0 0 1.25em rgba( 0, 0, 0, .5 );
    -moz-box-shadow: inset 0 1px 0 rgba( 255, 255, 255, .15 ), 0 0 1.25em rgba( 0, 0, 0, .5 );
    box-shadow: inset 0 1px 0 rgba( 255, 255, 255, .15 ), 0 0 1.25em rgba( 0, 0, 0, .5 );
    -webkit-border-radius: 2px;
    -moz-border-radius: 2px;
    border-radius: 2px;
  }
  .audioplayer-mini
  {
    width: 2.5em; /* 40 */
    margin: 0 auto;
  }
  .audioplayer > div
  {
    position: absolute;
  }
  .audioplayer-playpause
  {
    width: 2.5em; /* 40 */
    height: 100%;
    text-align: left;
    text-indent: -9999px;
    cursor: pointer;
    z-index: 2;
    top: 0;
    left: 0;
  }
  .audioplayer:not(.audioplayer-mini) .audioplayer-playpause
  {
    border-right: 1px solid #555;
    border-right-color: rgba( 255, 255, 255, .1 );
  }
  .audioplayer-mini .audioplayer-playpause
  {
    width: 100%;
  }
  .audioplayer-playpause:hover,
  .audioplayer-playpause:focus
  {
    background-color: #222;
  }
  .audioplayer-playpause a
  {
    display: block;
  }
  .audioplayer:not(.audioplayer-playing) .audioplayer-playpause a
  {
    width: 0;
    height: 0;
    border: 0.5em solid transparent;
    border-right: none;
    border-left-color: #fff;
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -0.5em 0 0 -0.25em;
  }
  .audioplayer-playing .audioplayer-playpause a
  {
    width: 0.75em;
    height: 0.75em;
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -0.375em 0 0 -0.375em;
  }
  .audioplayer-playing .audioplayer-playpause a:before,
  .audioplayer-playing .audioplayer-playpause a:after
  {
    width: 40%;
    height: 100%;
    background-color: #fff;
    content: '';
    position: absolute;
    top: 0;
  }
  .audioplayer-playing .audioplayer-playpause a:before
  {
    left: 0;
  }
  .audioplayer-playing .audioplayer-playpause a:after
  {
    right: 0;
  }
  .audioplayer-time
  {
    width: 4.375em;
    height: 100%;
    line-height: 2.375em;
    text-align: center;
    z-index: 2;
    top: 0;
  }
  .audioplayer-time-current
  {
    border-left: 1px solid #111;
    border-left-color: rgba( 0, 0, 0, .25 );
    left: 2.5em;
  }
  .audioplayer-time-duration
  {
    border-right: 1px solid #555;
    border-right-color: rgba( 255, 255, 255, .1 );
    right: 0;
  }
  .audioplayer-novolume .audioplayer-time-duration
  {
    border-right: 0;
    right: 0;
  }
  .audioplayer-bar
  {
    height: 0.875em;
    background-color: #222;
    cursor: pointer;
    z-index: 1;
    top: 50%;
    right: 4.875em;
    left: 6.875em;
    margin-top: -0.438em;
  }
  .audioplayer-novolume .audioplayer-bar
  {
    right: 4.375em;
  }
  .audioplayer-bar div
  {
    width: 0;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }
  .audioplayer-bar-loaded
  {
    background-color: #333;
    z-index: 1;
  }
  .audioplayer-bar-played
  {
    background: #007fd1;
    background: -webkit-gradient( linear, left top, right top, from( #007fd1 ), to( #c600ff ) );
    background: -webkit-linear-gradient( left, #007fd1, #c600ff );
    background: -moz-linear-gradient( left, #007fd1, #c600ff );
    background: -ms-radial-gradient( left, #007fd1, #c600ff );
    background: -o-linear-gradient( left, #007fd1, #c600ff );
    background: linear-gradient( left, #007fd1, #c600ff );
    z-index: 2;
  }
  .audioplayer-volume-button a:before,
  .audioplayer-volume-button a:after
  {
    content: '';
    position: absolute;
  }
  .audioplayer:not(.audioplayer-mute) .audioplayer-volume-button a:after
  {
    /* "volume" icon by Nicolas Gallagher, http://nicolasgallagher.com/pure-css-gui-icons */
    width: 0.313em;
    height: 0.313em;
    border: 0.25em double #fff;
    border-width: 0.25em 0.25em 0 0;
    left: 0.563em;
    top: -0.063em;
    -webkit-border-radius: 0 0.938em 0 0;
    -moz-border-radius: 0 0.938em 0 0;
    border-radius: 0 0.938em 0 0;
    -webkit-transform: rotate( 45deg );
    -moz-transform: rotate( 45deg );
    -ms-transform: rotate( 45deg );
    -o-transform: rotate( 45deg );
    transform: rotate( 45deg );
  }
  .audioplayer-volume:not(:hover) .audioplayer-volume-adjust
  {
    opacity: 0;
  }
  .audioplayer-volume:hover .audioplayer-volume-adjust
  {
    top: auto;
    bottom: 100%;
  }
  .audioplayer-volume-adjust > div
  {
    width: 40%;
    height: 80%;
    background-color: #222;
    cursor: pointer;
    position: relative;
    z-index: 1;
    margin: 30% auto 0;
  }
  .audioplayer-volume-adjust div div
  {
    width: 100%;
    height: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    background: #007fd1;
    background: -webkit-gradient( linear, left bottom, left top, from( #007fd1 ), to( #c600ff ) );
    background: -webkit-linear-gradient( bottom, #007fd1, #c600ff );
    background: -moz-linear-gradient( bottom, #007fd1, #c600ff );
    background: -ms-radial-gradient( bottom, #007fd1, #c600ff );
    background: -o-linear-gradient( bottom, #007fd1, #c600ff );
    background: linear-gradient( bottom, #007fd1, #c600ff );
  }
  .audioplayer-volume a
  {
    -webkit-filter: drop-shadow( 1px 1px 0 #000 );
    -moz-filter: drop-shadow( 1px 1px 0 #000 );
    -ms-filter: drop-shadow( 1px 1px 0 #000 );
    -o-filter: drop-shadow( 1px 1px 0 #000 );
    filter: drop-shadow( 1px 1px 0 #000 );
  }
  .audioplayer-bar,
  .audioplayer-bar div,
  .audioplayer-volume-adjust div
  {
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
  }
  .audioplayer-bar,
  .audioplayer-volume-adjust > div
  {
    -webkit-box-shadow: -1px -1px 0 rgba( 0, 0, 0, .5 ), 1px 1px 0 rgba( 255, 255, 255, .1 );
    -moz-box-shadow: -1px -1px 0 rgba( 0, 0, 0, .5 ), 1px 1px 0 rgba( 255, 255, 255, .1 );
    box-shadow: -1px -1px 0 rgba( 0, 0, 0, .5 ), 1px 1px 0 rgba( 255, 255, 255, .1 );
  }
  .audioplayer-volume-adjust div div,
  .audioplayer-bar-played
  {
    -webkit-box-shadow: inset 0 0 5px rgba( 255, 255, 255, .5 );
    -moz-box-shadow: inset 0 0 5px rgba( 255, 255, 255, .5 );
    box-shadow: inset 0 0 5px rgba( 255, 255, 255, .5 );
  }
  .audioplayer *,
  .audioplayer *:before,
  .audioplayer *:after
  {
    -webkit-transition: color .25s ease, background-color .25s ease, opacity .5s ease;
    -moz-transition: color .25s ease, background-color .25s ease, opacity .5s ease;
    -ms-transition: color .25s ease, background-color .25s ease, opacity .5s ease;
    -o-transition: color .25s ease, background-color .25s ease, opacity .5s ease;
    transition: color .25s ease, background-color .25s ease, opacity .5s ease;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }
  .fade-leave-active{
    transition: opacity .1s
  }
  .fade-leave-to{
    opacity: 0
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active in below version 2.1.8 */ {
    opacity: 0
  }
</style>

