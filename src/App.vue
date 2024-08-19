<script setup>

</script>

<template>
  <header>
    <div class="container my-4">
      <div class="alert alert-light" role="alert">
        <h2>SnapAnswer<a href="https://github.com/immengzi/Exam_Papers_To_Markdown" style="text-decoration: none; color: inherit;">
            <i class="bi bi-github github"></i>
          </a>
        </h2>
        借助百度云 OCR 进行文字识别，GPT 进行位置纠错，将试题 PDF 中的文字提取出来，再通过 GPT 进一步生成参考答案。
      </div>
    </div>
  </header>

  <main>
    <div class="container my-4">
      <router-view/>
    </div>
  </main>

  <footer></footer>
</template>

<style scoped>
.github {
  padding-left: 5px;
  cursor: pointer;
}
</style>
