<script setup>

import router from "@/router.js";
</script>

<template>
  <div id="accordionExample" class="accordion">
    <div class="accordion-item">
      <h2 class="accordion-header">
        <button class="accordion-button" data-bs-target="#collapseOne" data-bs-toggle="collapse" type="button">
          百度云 OCR API KEY | 百度云 OCR SECRET KEY
        </button>
      </h2>
      <div id="collapseOne" class="accordion-collapse collapse show">
        <div class="accordion-body">
          可参考 <a href="https://ai.baidu.com/ai-doc/OCR/vk3h7y58v" target="_blank">百度云文字识别 OCR 文档</a> 获取
          API KEY 和 SECRET KEY。
        </div>
      </div>
    </div>
    <div class="accordion-item">
      <h2 class="accordion-header">
        <button class="accordion-button collapsed" data-bs-target="#collapseTwo" data-bs-toggle="collapse"
                type="button">
          GPT API URL | GPT API KEY | GPT API MODEL
        </button>
      </h2>
      <div id="collapseTwo" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
        <div class="accordion-body">
          可参考 <a href="https://beta.openai.com/docs/api-reference" target="_blank">OpenAI 文档</a> 获取 API Base URL
          和 API KEY。<br>
          或者参考 <a href="https://doc.closeai-asia.com/tutorial/introduction.html" target="_blank">CloseAI 文档</a> 获取
          API Base URL 和 API KEY。<br>
          或者你知道的其他 GPT API Base URL 和 API KEY。
          <hr>
          目前支持的 GPT 模型有：
          <ul>
            <li>gpt-3.5-turbo</li>
            <li>gpt-4</li>
            <li>gpt-4-turbo</li>
            <li>gpt-4o</li>
            <li>gpt-4o-mini（推荐）</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="accordion-item">
      <h2 class="accordion-header">
        <button class="accordion-button collapsed" data-bs-target="#collapseThree" data-bs-toggle="collapse"
                type="button">
          Other
        </button>
      </h2>
      <div id="collapseThree" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
        <div class="accordion-body">
          <strong>本网站不会保留你的任何提交记录。</strong>
        </div>
      </div>
    </div>
  </div>
  <div class="my-3 button-container">
    <button class="btn btn-light" type="button" @click="(() => {router.push('/')})">我知道了，立即使用服务</button>
  </div>

</template>

<style scoped>
.button-container {
  display: flex;
  justify-content: center;
}
</style>