<template>
<div>
  <!-- <div style="border: 1px solid red;" @click="beforeMonth()">
  </div> -->
  <div>
    <div class="row wrap-header" style="background-color: #5e72e4">
      <div class="col-lg-1 mt-4" @click="beforeMonth()">
        <i class="ni ni-bold-left float-left pl-1"></i>
      </div>
      <div class="col-lg-10 pt-1">
        <h2 class="month-year" style="color: white;">
          {{month+1}}월, {{year}}년</h2>
      </div>
      <div class="col-lg-1 mt-4" @click="afterMonth()">
        <i class="ni ni-bold-right float-right pr-1"></i>
      </div>
    </div>
    <table class="table table-responsive month-year">
      <thead>
          <tr>
            <th scope="col" class="day-title" v-for="day in days" :key="day" style="font-size: 20px;">{{ day }}</th>
          </tr>
      </thead>
      <tbody>
          <tr class="week" v-for="(weeks, FirstIdx) in dates" :key="FirstIdx">
            <td class=" dayjustify-content-center pl-0 pr-0" scope="row" v-for="(date, SecondIdx) in weeks" :key="SecondIdx" style="height:7rem; width: 7rem;">
              <div style="color: #5e72e4">
                {{ date }}
              </div>
              <!-- <div style="background-color: black; height: 1rem; width: 100%"></div>
              <div style="background-color: red; height: 1rem; width: 100%"></div>
              <div style="background-color: blue; height: 1rem; width: 100%"></div> -->
            </td>
          </tr>
      </tbody>
    </table>
  </div>
</div>
</template>
<script>

export default{
  data(){
    return{
      today: null,
      year: null,
      date: null,
      month: null,
      lastMonthLastDate: null,
      lastMonthLastDay: null,
      thisMonthLastDate: null,
      nextMonthFirstDay: null,
      week: [],
      dates: [],
      days: ["일", "월", "화", "수", "목", "금", "토"],
    }
  },
  created(){ // 이번달, 이변년도, 오늘 날짜에 대한 초기값을 받는다.
    this.today = new Date();
    console.log(this.today.getMonth());
    this.year = this.today.getFullYear();
    this.month = this.today.getMonth();
    this.date = this.today.getDate();
    console.log(this.year, this.month, this.date);
    this.getFirstAndLastDate(); // 달력의 전체 날짜를 출력하는 함수
    // this.getPrevMonth(this.lastMonthLastDate, this.lastMonthLastDay);
    // this.getThisMonth(this.thisMonthLastDate);
    // this.getNextMonth(this.nextMonthFirstDay);
  },
  methods: {
    checkLength(){
      if(this.week.length == 7){
        this.$set(this.dates, this.dates.length, this.week);
        this.week = [];
      }
    },
    getFirstAndLastDate(){ //저반달 마지막 날짜, 저번달 마지막 요일, 이번달 마지막 날짜, 다음달 첫번째 요일 구하기
      const lastMonthLastDate = new Date(this.year, this.month, 0).getDate();
      const lastMonthLastDay = new Date(this.year, this.month, 0).getDay();
      const thisMonthLastDate = new Date(this.year, this.month+1, 0).getDate();
      const nextMonthFirstDay = new Date(this.year, this.month+1).getDay();
      // this.getFirstAndLastDate(this.month, this.year); // 달력의 전체 날짜를 출력하는 함수
      this.getPrevMonth(lastMonthLastDate, lastMonthLastDay);
      this.getThisMonth(thisMonthLastDate);
      this.getNextMonth(nextMonthFirstDay);

      // return [this.lastMonthLastDate=lastMonthLastDate, this.lastMonthLastDay=lastMonthLastDay, 
      // this.thisMonthLastDate=thisMonthLastDate, this.nextMonthFirstDay=nextMonthFirstDay];
    },
    beforeMonth(){
      this.dates = [];
      this.week = [];
      if(this.month == 0){
        this.year -= 1;
        this.month = 11;
      }else{
        this.month -= 1;
      }
      this.getFirstAndLastDate();
    },
    afterMonth(){
      this.dates = [];
      this.week = [];
      if(this.month == 11){
        this.year += 1;
        this.month = 0;
      }else{
        this.month += 1;
      }
      this.getFirstAndLastDate();
    },
    getPrevMonth(prevLastDate, prevLastDay){ //저번달 출력
      if(prevLastDay!==6){
        for(let date = prevLastDate-prevLastDay; date <= prevLastDate; date++){
          this.$set(this.week, this.week.length, date);
          this.checkLength();
        }
      }
    },
    getThisMonth(thisMonthLastDate){ //이번달 출력
      for(let date = 1; date<=thisMonthLastDate; date++){
        this.$set(this.week, this.week.length, date);
        this.checkLength();
      }
    },
    getNextMonth(nextMonthFirstDay){
      if(nextMonthFirstDay!==0){
        for(let date = 1 ; date <= 7-nextMonthFirstDay; date++){
          this.$set(this.week, this.week.length, date);
          this.checkLength();
        }
      }
    }
  }
}
</script>
<style>
*,
*::before,
*::after {
  padding: 0;
  margin: 0;
  box-sizing: border-box
}

/* body {
  display: flex;
  min-height: 100vh;
  padding: 5vh 5vw;
  color: #37474f;
  line-height: 1.5;
  font-family: Lato, sans-serif;
  background-color: #cfd8dc;
} */

.note {
  font-size: calc(0.5vw + 0.75rem);
  text-align: center;
  opacity: 0.5;
}

.button {
  display: inline-block;
  padding: 0.5em 1em;
  color: #fff;
  font-weight: bold;
  font-size: 0.6875em;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.0625em;
  background-color: #37474F;
  border-radius: 1.5em;
  cursor: pointer;
}

.calendar-wrap {
  width: 100%;
  padding: 0.75em;
  margin: auto;
  font-size: 4vw;
  background-color: #fff;
  border-radius: 1.5em;
  user-select: none;
  box-shadow:
    0 0.0625em 0.25em rgba(0,20,50,0.2),
    0 0.5em 0.5em 0.125em rgba(0,20,50,0.1);
}

@media (min-width: 500px) {
  .calendar-wrap {
    width: 450px;
    font-size: 1.25rem;
  }
}

.month-year {
  margin-top: 0.75em;
  margin-bottom: 1em;
  font-weight: normal;
  font-size: 1.25em;
  text-align: center;
}

.wrap-header{
  border-radius: 20px 20px 0px 0px;
}
.calendar {
  table-layout: fixed;
  width: 100%;
  margin-bottom: 0.75em;
  overflow: hidden;
  border-collapse: collapse;
  -webkit-tap-highlight-color: transparent;
}

.day-title {
  width: 4em;
  height: 4em;
  vertical-align: top;
  font-weight: bold;
  font-size: 0.75em;
  text-transform: uppercase;
  letter-spacing: 0.0625em;
  box-shadow:
    inset 0 -0.875em #fff,
    inset 0 -1em rgba(0,20,50,0.1);
}

.day {
  position: relative;
  height: 3em;
}

.day:focus {
  outline: none;
}

.day:focus .day-number::after {
  content: '';
  position: absolute;
  z-index: -1;
  top: 50%;
  left: 50%;
  width: 80%;
  height: 80%;
  transform: translate(-50%,-50%);
  border: 0.25em solid #0288d1;
  border-radius: 50%;
}

.day.active-a:focus .day-number::after,
.day.active-b:focus .day-number::after {
  width: 100%;
  height: 100%;
}

.day.today:focus .day-number::after {
  width: 102%;
  height: 102%;
}

.day:hover span.day-number {
  color: #0288d1;
}

.day:first-child,
.day:last-child {
  color: rgba(0,0,0,0.5);
}

.day.range {
  color: #0288d1;
  background-color: #e1f5fe;
}

.day.range.active-a,
.day:not(.range) + .day.range.active-b {
  background-color: transparent;
  box-shadow: inset -1.5em 0 #e1f5fe;
}

.day.range.active-b,
.day.range + .day.range.active-a {
  background-color: transparent;
  box-shadow: inset 1.5em 0 #e1f5fe;
}

.day.range.active-a:first-child,
.day.range.active-b:first-child {
  box-shadow: none;
}

.day.range.active-a:first-child + .day.range,
.day.range.active-b:first-child + .day.range {
  box-shadow: -1.5em 0 #e1f5fe;
}

.day.range.active-a:first-child + .day:not(.range),
.day.range.active-b:first-child + .day:not(.range) {
  box-shadow: -4.5em 0 #e1f5fe;
}

.day.range.active-a:first-child + .day.range.active-b {
  box-shadow:
    -1.5em 0 #e1f5fe,
    inset 1.5em 0 #e1f5fe;
}

.day-number {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 3em;
  border-radius: 50%;
}

.day.active-a span.day-number,
.day.active-b span.day-number {
  color: #fff;
  background-color: #03A9F4;
}

.day.prev-mon .day-number,
.day.next-mon .day-number {
  color: rgba(0,0,0,0.3);
}

.day.prev-mon[class*="active"] .day-number,
.day.next-mon[class*="active"] .day-number {
  color: rgba(255,255,255,0.5);
  background-color: #81D4FA;
}

.day.today span.day-number {
  color: #fff;
  border: 0.25em solid transparent;
  box-shadow: inset 0 0 0 2em #37474F;
}

.calendar-wrap .reset {
  display: block;
}
</style>