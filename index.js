const $form = document.querySelector("form");
const $chatList = document.querySelector(".chat-list");
const $recipeButton = document.querySelector("#recipe-button");
const $newMenuButton = document.querySelector("#new-menu-button");

// openAI API
let url = `https://estsoft-openai-api.jejucodingcamp.workers.dev/`;

// 질문과 답변 저장
let data = [
  {
    role: "system",
    content: "assistant는 친절한 답변가이다.",
  },
];

// 화면에 뿌려줄 데이터, 질문들
let questionData = [];

// 사용자의 질문을 객체를 만들어서 push
const sendQuestion = (question) => {
  if (question) {
    data.push({
      role: "user",
      content: question,
    });
    questionData.push({
      role: "user",
      content: question,
    });
  }
};

// 화면에 질문 그려주는 함수
const printQuestion = async () => {
  if (questionData.length > 0) {
    let li = document.createElement("li");
    li.classList.add("question");
    
    questionData.map((el) => {
      li.innerText += el.content;
    });

    $chatList.appendChild(li);
    
   // clear the questions after rendering to avoid duplication in next render 
   questionData.length=0; 
  }
};

// 화면에 답변 그려주는 함수
const printAnswer = (answer) => {
  let li = document.createElement("li");
  li.classList.add("answer");
  
  li.innerText += answer;
  
  $chatList.appendChild(li);
};

// api 요청보내는 함수
const apiPost = async () => {

 const response= await fetch(url, {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
     })
     
     if(response.ok){
       const result=await response.json();
       printAnswer(result.choices[0].message.content);
     }else{
         console.log('API request error',response.status)
     }

}

$form.addEventListener('submit', function(e){
   e.preventDefault();
   
   const foodType=document.querySelector('input[name="food type"]:checked').value;
   const weather=document.querySelector('input[name="weather"]:checked').value;

   sendQuestion(`음식 종류 : ${foodType}, 날씨 : ${weather}`);
   
   apiPost();
   
   printQuestion();

});

$recipeButton.addEventListener("click", function() {
    // Get the recipe for the current menu
    // This assumes that you have a function getRecipe(menu) that returns a promise with the recipe data
    const menu = data[data.length - 1].content;  // Assuming the last item in `data` is the current menu
    getRecipe(menu).then(recipe => {
        printAnswer(`Here is your recipe:\n${recipe}`);
    });
});

$newMenuButton.addEventListener("click", function() {
    // Request a new menu recommendation
    apiPost();
});
