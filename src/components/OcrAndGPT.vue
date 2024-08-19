<script setup>
import {ref} from "vue";
import axios from "axios";
import OpenAI from 'openai';
import MdEditor from "@/components/MdEditor.vue";
import router from "@/router.js";

const buildOcrTxt = '请根据以下OCR结果整理并重组这份试卷的内容。使用简洁明了的Markdown格式进行排版，但不需要加入Markdown的代码块标记。保持内容和结构与原试卷一致，去除所有版权相关描述。注意检查并纠正明显的OCR识别错误。'
const buildAnswerTxt = '你现在扮演一个计算机专业的学生，负责完成以下试题。请直接使用Markdown格式作答，但无需添加Markdown的代码块标记。确保你的回答是准确、严谨和专业的。'

const baiduYunOcrApiKey = ref('');
const baiduYunOcrSecretKey = ref('');
const gptApiUrl = ref('');
const gptApiKey = ref('');
const gptApiModel = ref('gpt-4o-mini');
const samplePdf = ref(null);
const ocrResult = ref('# Ocr Result');
const answerResult = ref('# Answer Result');

async function startOcr() {

  try {
    const accessToken = await getAccessToken();
    const samplePdfBase64 = await getFileContentAsBase64(samplePdf.value);

    const options = {
      method: 'POST',
      url: `/api/rest/2.0/ocr/v1/general?access_token=${accessToken}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      data: new URLSearchParams({
        'pdf_file': samplePdfBase64,
      }).toString(),
    };

    const response = await axios(options);
    alert("百度云通用文字识别（标准含位置版）完成")
    console.log(response.data);

    const gptClient = new OpenAI({baseURL: gptApiUrl.value, apiKey: gptApiKey.value, dangerouslyAllowBrowser: true});
    const ocrText = response.data.words_result.map(item => item.words).join('\n');
    const buildOcrPrompt = buildOcrTxt + '\n\n' + ocrText;
    const gptResponse = await gptClient.chat.completions.create({
      messages: [{role: 'user', content: buildOcrPrompt}],
      model: gptApiModel.value
    });

    ocrResult.value = gptResponse.choices[0].message.content;
    alert("GPT 文字识别纠错完成")
    console.log(ocrResult.value);

  } catch (error) {
    console.error("处理 PDF 文件失败: ", error);
    alert("处理 PDF 文件失败: " + error.message)
  }
}

async function startAnswer() {
  if (!ocrResult.value || ocrResult.value === '# Ocr Result') {
    alert("请先进行文字识别");
    return;
  }
  try {
    const gptClient = new OpenAI({baseURL: gptApiUrl.value, apiKey: gptApiKey.value, dangerouslyAllowBrowser: true});
    const buildAnswerPrompt = buildAnswerTxt + '\n\n' + ocrResult.value;
    const gptResponse = await gptClient.chat.completions.create({
      messages: [{role: 'user', content: buildAnswerPrompt}],
      model: gptApiModel.value
    });

    answerResult.value = gptResponse.choices[0].message.content;
    alert("生成参考答案完成")
    console.log(answerResult.value);

  } catch (error) {
    console.error("生成参考答案失败: ", error);
  }
}

function getAccessToken() {
  return axios.post('/api/oauth/2.0/token?grant_type=client_credentials&client_id=' + baiduYunOcrApiKey.value + '&client_secret=' + baiduYunOcrSecretKey.value)
      .then(response => {
        return response.data.access_token;
      })
      .catch(error => {
        console.error("获取百度云 OCR 鉴权签名失败: ", error);
        throw error;
      });
}

function getFileContentAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}

function exportToMd(txt) {
  const blob = new Blob([txt], {type: 'text/markdown'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'export-' + new Date().toISOString().replace(/[:.]/g, '-') + '.md';
  a.click();
  URL.revokeObjectURL(url);
}

function goToHelp() {
  router.push('/help');
}

</script>

<template>
  <form @submit.prevent="startOcr">
    <div class="mb-3">
      <label class="form-label" for="baiduYunOcrApiKey">百度云 OCR API KEY</label>
      <i class="bi bi-info-circle help" @click="goToHelp"></i>
      <input id="baiduYunOcrApiKey" v-model="baiduYunOcrApiKey" class="form-control" required type="password">
    </div>

    <div class="mb-3">
      <label class="form-label" for="baiduYunOcrSecretKey">百度云 OCR SECRET KEY</label>
      <i class="bi bi-info-circle help" @click="goToHelp"></i>
      <input id="baiduYunOcrSecretKey" v-model="baiduYunOcrSecretKey" class="form-control" required type="password">
    </div>

    <div class="mb-3">
      <label class="form-label" for="gptApiUrl">GPT API URL</label>
      <i class="bi bi-info-circle help" @click="goToHelp"></i>
      <input id="gptApiUrl" v-model="gptApiUrl" class="form-control" required type="url">
      <div id="gptApiUrlHelp" class="form-text">example: https://api.openai-proxy.org/v1</div>
    </div>

    <div class="mb-3">
      <label class="form-label" for="gptApiKey">GPT API KEY</label>
      <i class="bi bi-info-circle help" @click="goToHelp"></i>
      <input id="gptApiKey" v-model="gptApiKey" class="form-control" required type="password">
    </div>

    <div class="mb-3">
      <label class="form-label" for="gptApiModel">GPT API MODEL</label>
      <i class="bi bi-info-circle help" @click="goToHelp"></i>
      <select id="gptApiModel" v-model="gptApiModel" class="form-select" required>
        <option>gpt-3.5-turbo</option>
        <option>gpt-4</option>
        <option>gpt-4-turbo</option>
        <option>gpt-4o</option>
        <option>gpt-4o-mini</option>
      </select>
    </div>

    <div class="mb-3">
      <label class="form-label" for="pdfPath">要处理的 PDF 路径</label>
      <input id="pdfPath" accept="application/pdf" class="form-control" required
             type="file" @input="samplePdf = $event.target.files[0]">
    </div>

    <div class="mb-3 button-container">
      <button id="ocrBtn" class="btn btn-light" type="submit">启动文字识别</button>
    </div>
  </form>

  <div class="mb-3">
    <label class="form-label" for="ocrResult">文字识别结果</label>
    <i class="bi bi-download download" @click="exportToMd(ocrResult)"></i>
    <MdEditor v-model="ocrResult"/>
  </div>

  <div class="mb-3 button-container">
    <button id="exportAnswerResultBtn" class="btn btn-light" type="button" @click="startAnswer">生成参考答案
    </button>

  </div>

  <div class="mb-3">
    <label class="form-label" for="ocrResult">参考答案</label>
    <i class="bi bi-download download" @click="exportToMd(answerResult)"></i>
    <MdEditor v-model="answerResult"/>
  </div>
</template>

<style scoped>
.button-container {
  display: flex;
  justify-content: center;
}

.help, .download {
  padding-left: 5px;
  cursor: pointer;
}
</style>
