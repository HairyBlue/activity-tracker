<script lang="ts" setup>
import $ from 'jquery';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { userStore } from '../../../../store/userStore';

const router =useRouter();
const route = useRoute();
const user = userStore();

const maxImage = import.meta.env.MAX_IMAGE_COUNT ? parseInt(import.meta.env.MAX_IMAGE_COUNT) : 5;
const maxPdf = import.meta.env.MAX_PDF_COUNT ? parseInt(import.meta.env.MAX_PDF_COUNT) : 2;
const maxVideo = import.meta.env.MAX_VIDEO_COUNT ? parseInt(import.meta.env.MAX_VIDEO_COUNT) : 1;

const maxImageSize =  import.meta.env.MAX_IMAGE_SIZE ? (parseInt(import.meta.env.MAX_IMAGE_SIZE) * 1024 * 1024) : 5 * 1024 * 1024;
const maxPdfSize = import.meta.env.MAX_PDF_SIZE ? (parseInt(import.meta.env.MAX_PDF_SIZE) * 1024 * 1024) : 3 * 1024 * 1024;
const maxVideoSize = import.meta.env.MAX_VIDEO_SIZE ? (parseInt(import.meta.env.MAX_VIDEO_SIZE) * 1024 * 1024) : 25 * 1024 * 1024;

const imageRgx: any = /jpeg|jpg|png|gif/;
const pdfRgx: any = /pdf/;
const videoRgx: any = /mp4|webm|ogg/;

const documentId = ref<any>(null);
const staticImages = ref<string[]>([]);
const staticPDFs = ref<string[]>([]);
const staticVideos = ref<string[]>([]);

const filesStored = ref<any>({
  image: [],
  pdf: [],
  video: [],
});

const errorMessage = ref<string>('');
const enableError = ref<boolean>(false);
const okStatus = ref<boolean>(false);

const filePathToDelete = ref<string>('');
const fileNameToDelete = ref<string>('');

let setTOut: any = null;

function getFileName(file: string) {
  if (file.startsWith('attachments/')) {
    const fileArr = file.split('/');
    return fileArr[fileArr.length - 1];
  }
  return '';
}
function fileDeleteFunc(file: string) {
  if (file.startsWith('attachments/')) {
    filePathToDelete.value = file;
    fileNameToDelete.value = getFileName(file);
    const modal: any = document.getElementById('deleteFileModal');

    modal.showModal();
  }
}

function removeError() {
  enableError.value = false;
}
function removeOk() {
  okStatus.value = false;
}

function onDrag(event: DragEvent) {
  event.preventDefault();
}

function onDrop(event: DragEvent) {
  event.preventDefault();
  //   console.log(event.dataTransfer?.files);
  addFile(event.dataTransfer?.files);
}

function onInsert(event: any) {
  event.preventDefault();
  addFile(event.target.files);
}

function addFile(rawFiles: any) {
  const files = rawFiles; // event.dataTransfer.files;
  attachedFiles(files, cb);
  // console.log(filesStored.value);
}

function cb(errMsg: any, files: any) {
  if (!errMsg) {
    if (files) appendFiles(files);
  } else {
    errorMessage.value = errMsg;
    enableError.value = true;

    if (setTOut) {
      clearTimeout(setTOut);
    }

    setTOut = setTimeout(() => {
      enableError.value = false;
      okStatus.value = false;
    }, 10000);
  }
}

function getExtName(file: any) {
  const filePart = file.split('.');

  if (typeof filePart != 'object') {
    return '';
  }

  return filePart[filePart.length - 1];
}

function attachedFiles(files: FileList, cb: any) {
  let errorMessage = null;

  for (let file of files) {
    const fileType = file.type;
    const fileName = file.name.toLowerCase();
    const fileExt = getExtName(fileName);

    if (fileType.startsWith('image/')) {
      if (!imageRgx.test(fileExt)) {
        errorMessage = 'Image upload only supports the following file types - ' + imageRgx;
      }
      if (filesStored.value.image.length + 1 > maxImage) {
        errorMessage = 'Limit image upload up to ' + maxImage + ' images only';
      }
    } else if (fileType === 'application/pdf') {
      if (!pdfRgx.test(fileExt)) {
        errorMessage = 'Document upload only supports the following file types - ' + pdfRgx;
      }
      if (filesStored.value.pdf.length + 1 > maxPdf) {
        errorMessage = 'Limit pdf upload up to ' + maxPdf + " pdf's only";
      }
    } else if (fileType.startsWith('video/')) {
      if (!videoRgx.test(fileExt)) {
        errorMessage = 'Video upload only supports the following file types - ' + videoRgx;
      }

      if (filesStored.value.video.length + 1 > maxVideo) {
        errorMessage = 'Limit video upload up to ' + maxVideo + ' video only';
      }
    } else {
      errorMessage = 'File upload only supports image, pdf, and video';
    }

    cb(errorMessage, file);
  }
}

function appendFiles(file: any) {
  const fileType = file.type;
  const fileName = file.name;
  const fileSize = file.size;
  const fileUrl = URL.createObjectURL(file);

  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);

  const obj: any = {
    fileName: fileName,
    fileId: uniqueSuffix,
    fileContent: file,
    fileSize: fileSize,
    fileUrl: fileUrl,
    fileType: fileType,
  };

  if (fileType.startsWith('image/')) {
    obj.maxSize = maxImageSize;
    filesStored.value.image.push(obj);
  } else if (fileType == 'application/pdf') {
    obj.maxSize = maxPdfSize;
    filesStored.value.pdf.push(obj);
  } else if (fileType.startsWith('video/')) {
    obj.maxSize = maxVideoSize;
    filesStored.value.video.push(obj);
  }
}

function bytesToMb(bytes: number) {
  return (bytes / (1024 * 1024)).toFixed(2).toString() + ' mb';
}

function unlinkFile() {
  for (let file in filesStored.value) {
    filesStored.value[file] = [];
  }
}

function removeFileStored(fid: any) {
  for (let files in filesStored.value) {
    const filtered = filesStored.value[files].filter((obj: any) => obj.fileId != fid);
    filesStored.value[files] = filtered;
  }
}

function addImageCaption(fid: any) {
  for (let image of filesStored.value.image) {
    if (image.fileId == fid) {
      const inputElement = document.getElementById(image.fileId) as HTMLInputElement;
      image['fileCaption'] = inputElement.value;
    }
  }
}

function checkFile() {
  if (filesStored.value.image.length === 0 && filesStored.value.pdf.length === 0 && filesStored.value.video.length === 0) {
    return false;
  }

  for (let files in filesStored.value) {
    for (let file of filesStored.value[files]) {
      const contentSize = file.fileContent.size;
      const fileExceed = contentSize > file.maxSize;

      if (fileExceed) {
        errorMessage.value = `Failed to submit, ${file.fileContent.name} (${bytesToMb(contentSize)}) exceed file upload to ${bytesToMb(file.maxSize)}`;
        enableError.value = true;

        if (setTOut) {
          clearTimeout(setTOut);
        }

        setTOut = setTimeout(() => {
          enableError.value = false;
          okStatus.value = false;
        }, 10000);

        return false;
      }
    }
  }

  return true;
}

function uploadFiles() {
  if (checkFile()) {
    const formData = new FormData();
    let imageCaptionn = '';

    for (let files in filesStored.value) {
      for (let file of filesStored.value[files]) {
        formData.append(files, file.fileContent);
        if (files == 'image') {
          imageCaptionn += file.fileName + '|' + file.fileCaption + '|';
        }
      }
    }

    $.ajax({
      url: `${user.basePath}/api/file-upload/${route.params.activity_uuid}/?imageCaptions=${imageCaptionn}`,
      type: 'POST',
      processData: false,
      contentType: false,
      data: formData,
      beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', `Bearer ${user.getToken()}`);
      },
    })
    .done(()=>{
      router.go(0);
    })
  }
}

function getStaticFiles() {
  $.ajax({
    url: `${user.basePath}/api/file-upload/${route.params.activity_uuid}`,
    type: 'GET',
    contentType: 'application/json',
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', `Bearer ${user.getToken()}`);
    },
  }).then((value) => {
    const files = value.data;

    documentId.value = files.documentId;
    staticImages.value = files.images;
    staticPDFs.value = files.pdfs;
    staticVideos.value = files.videos;
  });
}


function deleteFiles() {
    const data = JSON.stringify({
      documentId: documentId.value,
      fileName: fileNameToDelete.value,
      filePathToDelete: filePathToDelete.value
    })

    $.ajax({
      url: `${user.basePath}/api/file-upload`,
      type: 'DELETE',
      contentType: 'application/json',
      data: data,
      beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', `Bearer ${user.getToken()}`);
      },
    })
    .done(()=>{
      router.go(0);
    })
  
}

onMounted(() => {
  getStaticFiles();
});
</script>

<template>
  <div class="h-screen ">
    <div class="flex w-full items-center justify-between text-4xl font-semibold">
      <span>Documents</span>
    </div>
    <!-- START DIV -->
    <div>
      <div>
        <!-- NOTE -->
        <div>
          <div role="alert" class="alert border border-gray-300 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="h-6 w-6 shrink-0 stroke-info">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <h3 class="font-bold text-2xl">Note</h3>
              <div class="text-base">
                Image upload only support only up to 5 images and supported formats - {{ imageRgx }}. (Max size of
                <span class="font-semibold">{{ bytesToMb(maxImageSize) }}</span> each)
              </div>
              <div class="text-base">
                PDF upload only support only up to 2 pdfs. (Max size of <span class="font-semibold">{{ bytesToMb(maxPdfSize) }}</span> each)
              </div>
              <div class="text-base">
                Video upload only support only up to 1 video and supported formats - {{ videoRgx }}. (Max size of <span class="font-semibold">{{ bytesToMb(maxVideoSize) }}</span
                >)
              </div>
            </div>
          </div>
        </div>
        <!-- ERROR -->
        <div v-if="enableError">
          <div>
            <div role="alert" class="alert alert-error mt-4">
              <div @click="removeError()">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span> {{ errorMessage }}</span>
            </div>
          </div>
        </div>
        <!-- ERROR -->
        <!-- OK -->
        <div v-if="okStatus">
          <div>
            <div role="alert" class="alert alert-success">
              <div @click="removeOk()">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span>Succesfully added activity</span>
            </div>
          </div>
        </div>
        <!-- OK -->
        <!-- DRAG AND DROP -->
        <div id="dropZone" class="card m-auto my-4 h-96 w-3/4 border border-dashed border-gray-600 bg-base-100 shadow-xl" @dragover="onDrag" @drop="onDrop">
          <div class="card-body">
            <h2 class="card-title">Drag and Drop file here</h2>
            <p>
              OR CLICK to
              <label for="file-input">Choose Files</label>
              <input type="file" id="file-input" multiple @change="onInsert" />
            </p>

            <div class="card-actions mb-12 justify-center">
              <button class="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg">+</button>
            </div>
          </div>
        </div>
        <!-- DRAG AND DROP -->

        <!--  Content WRAPPER -->
        <!--  Content WRAPPER -->
        <div>
          <!-- Preview -->
          <!-- Preview -->
          <!-- Preview -->
          <!-- Preview -->

          <div v-if="filesStored.image.length > 0 || filesStored.pdf.length > 0 || filesStored.video.length > 0" class="flex flex-col">
            <div>
              <h2 class="text-lg font-semibold">Preview File To Upload</h2>
            </div>
            <!-- IMAGE -->
            <details v-if="filesStored.image.length > 0" class="dropdown w-full">
              <summary class="btn btn-accent m-1 w-full">View Images</summary>
              <ul class="dropdown-content z-[3] flex flex-wrap gap-4 rounded-box border-gray-400 bg-base-100 p-2 shadow-md">
                <li v-for="images in filesStored.image">
                  <div class="card card-side bg-base-100 shadow-xl">
                    <figure>
                      <img :src="images.fileUrl" :alt="images.fileName" class="max-h-72 max-w-72" />
                    </figure>
                    <div class="card-body">
                      <div class="flex flex-col">
                        <label for="" class="text-base">Add image caption: </label>
                        <input type="text" placeholder="Type here" class="input input-bordered input-primary w-full" :id="images.fileId" @change="addImageCaption(images.fileId)" />
                      </div>

                      <div>
                        <h2 class="card-title">{{ images.fileName }}</h2>
                        <p class="text-base">File size: {{ bytesToMb(images.fileSize) }}</p>
                        <p><a class="link link-success text-base font-semibold" :href="images.fileUrl" target="_blank">View New Tab</a></p>
                        <div v-if="images.fileSize > maxImageSize" role="alert" class="alert shadow-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="h-6 w-6 shrink-0 stroke-info">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          <div>
                            <p>Image upload only supports up to {{ bytesToMb(maxImageSize) }}</p>
                          </div>
                        </div>
                      </div>

                      <div class="card-actions justify-end">
                        <button class="btn btn-primary" @click="removeFileStored(images.fileId)">Remove</button>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </details>
            <!-- IMAGE -->
            <!-- PDF -->
            <details v-if="filesStored.pdf.length > 0" class="dropdown w-full">
              <summary class="btn btn-error m-1 w-full">View PDFs</summary>
              <ul class="dropdown-content z-[2] flex flex-wrap gap-4 rounded-box border-gray-400 bg-base-100 p-2 shadow-md">
                <li v-for="pdf in filesStored.pdf">
                  <div class="card card-side bg-base-100 shadow-xl">
                    <iframe :src="pdf.fileUrl" frameborder="0" class="h-96"></iframe>
                    <div class="card-body">
                      <div>
                        <h2 class="card-title">{{ pdf.fileName }}</h2>
                        <p class="text-base">File size: {{ bytesToMb(pdf.fileSize) }}</p>
                        <p><a class="link link-success text-base font-semibold" :href="pdf.fileUrl" target="_blank">View New Tab</a></p>
                        <div v-if="pdf.fileSize > maxPdfSize" role="alert" class="alert shadow-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="h-6 w-6 shrink-0 stroke-info">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          <div>
                            <p>Pdf upload only supports up to {{ bytesToMb(maxPdf) }}</p>
                          </div>
                        </div>
                      </div>

                      <div class="card-actions justify-end">
                        <button class="btn btn-primary" @click="removeFileStored(pdf.fileId)">Remove</button>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </details>
            <!-- PDF -->

            <!-- Video -->
            <details v-if="filesStored.video.length > 0" class="dropdown w-full">
              <summary class="btn btn-info m-1 w-full">View Video</summary>
              <ul class="dropdown-content z-[1] flex flex-wrap gap-4 rounded-box border-gray-400 bg-base-100 p-2 shadow-md">
                <li v-for="video in filesStored.video">
                  <div class="card card-side bg-base-100 shadow-xl">
                    <!-- <iframe :src="video.fileUrl" frameborder="0" class="h-96 w-1/2"></iframe> -->

                    <video class="w-full" controls>
                      <source :src="video.fileUrl" :type="video.fileType" />
                    </video>
                    <div class="card-body">
                      <div>
                        <h2 class="card-title">{{ video.fileName }}</h2>
                        <p class="text-base">File size: {{ bytesToMb(video.fileSize) }}</p>
                        <p><a class="link link-success text-base font-semibold" :href="video.fileUrl" target="_blank">View New Tab</a></p>
                        <div v-if="video.fileSize > maxVideoSize" role="alert" class="alert shadow-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="h-6 w-6 shrink-0 stroke-info">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          <div>
                            <p>Video upload only supports up to {{ bytesToMb(maxVideoSize) }}</p>
                          </div>
                        </div>
                      </div>

                      <div class="card-actions justify-end">
                        <button class="btn btn-primary" @click="removeFileStored(video.fileId)">Remove</button>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </details>
            <!-- Video -->

            <!-- UPLOAD AND RESET  BUTTON-->
            <div class="flex w-full justify-end gap-2">
              <button class="btn btn-info" @click="uploadFiles()">Upload Files</button>
              <button class="btn btn-error" @click="unlinkFile">Unlink Files</button>
            </div>
          </div>
          <!-- END Preview -->
          <!-- END Preview -->
          <!-- END Preview -->
          <!-- END Preview -->
          <!--  -->
          <!--  -->
          <!-- VIEW FILE UPLOADED -->
          <!-- VIEW FILE UPLOADED -->
          <div>
            <div v-if="staticImages.length == 0 && staticPDFs.length == 0 && staticVideos.length == 0" class="mt-10 text-center text-2xl font-semibold text-gray-600">
              <div>
                <span>There are no previous files uploaded</span>
              </div>
            </div>

            <!-- STATIC PDFS -->
            <div v-if="staticPDFs.length > 0">
              <span class="text-2xl font-semibold">Document</span>
              <!-- v-for="pdf in staticPDFs" -->
              <div>
                <div class="mb-8 flex w-full gap-2">
                  <div v-for="pdf in staticPDFs" class="w-1/2">
                    <div class="badge badge-error mt-2 gap-2 rounded-none" @click="fileDeleteFunc(pdf)">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block h-4 w-4 stroke-current">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                      delete this file
                    </div>
                    <div>
                      <iframe :src="user.basePath + '/' + pdf" frameborder="0" class="h-[720px] w-full"></iframe>
                      <div class="text-wrap break-words"> 
                        {{ getFileName(pdf) }}
                      </div>
                    </div>
                  </div>

                  <!-- <div class="w-1/2">
                    <div class="badge badge-error mt-2 gap-2 rounded-none">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block h-4 w-4 stroke-current">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                      delete this file
                    </div>
                    <div>
                      <iframe src="https://css4.pub/2015/icelandic/dictionary.pdf" frameborder="0" class="h-[720px] w-full"></iframe>
                    </div>
                  </div>
                  <div class="w-1/2">
                    <div class="badge badge-error mt-2 gap-2 rounded-none">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block h-4 w-4 stroke-current">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                      delete this file
                    </div>
                    <iframe src="https://css4.pub/2015/icelandic/dictionary.pdf" frameborder="0" class="h-[720px] w-full"></iframe>
                  </div> -->
                </div>
              </div>
            </div>

            <!-- MEDIA -->
            <div v-if="staticImages.length > 0">
              <span class="text-2xl font-semibold">Media</span>
              <div>
                <!-- v-for="image in staticImages" -->
                <div class="flex flex-wrap gap-4">
                  <div v-for="image in staticImages" class="max-h-64 max-w-64">
                    <div class="badge badge-error mt-2 gap-2 rounded-none" @click="fileDeleteFunc(image)">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block h-4 w-4 stroke-current">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                      delete this file
                    </div>
                    <div>
                      <img :src="user.basePath + '/' + image" alt="" class="shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]" />
                      <div class="text-wrap break-words"> 
                        {{getFileName(image)}}
                      </div>
                      
                    </div>
                  </div>
                  <!-- <div class="max-h-64 max-w-64">
                    <img
                      src="https://images.pexels.com/photos/276267/pexels-photo-276267.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                      alt=""
                      class="shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]" />
                    Caption 1
                  </div> -->
                  <!-- <div class="max-h-64 max-w-64">
                    <img
                      src="https://images.pexels.com/photos/276267/pexels-photo-276267.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                      alt=""
                      class="shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]" />
                    Caption 2
                  </div>
                  <div class="max-h-64 max-w-64">
                    <img
                      src="https://images.pexels.com/photos/276267/pexels-photo-276267.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                      alt=""
                      class="shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]" />
                    Caption 3
                  </div>
                  <div class="max-h-64 max-w-64">
                    <img
                      src="https://images.pexels.com/photos/276267/pexels-photo-276267.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                      alt=""
                      class="shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]" />
                    Caption 2
                  </div>
                  <div class="max-h-64 max-w-64">
                    <img
                      src="https://images.pexels.com/photos/276267/pexels-photo-276267.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                      alt=""
                      class="shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]" />
                    Caption 3
                  </div> -->
                </div>
              </div>

              <div v-if="staticVideos.length > 0">
                <!-- v-for="video in staticVideos" -->
                <div class="flex w-full">
                  <!-- <video src="https://www.youtube.com/watch?v=dQw4w9WgXcQ"></video> -->
                  <!-- <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" class="w-full h-96"></iframe> -->

                  <div v-for="video in staticVideos">
                    <div class="badge badge-error mt-2 gap-2 rounded-none" @click="fileDeleteFunc(video)">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block h-4 w-4 stroke-current">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                      delete this file
                    </div>
                    <div>
                      <video controls class="h-96 w-full">
                        <source :src="user.basePath + '/' + video" />
                      </video>
                      <div class="text-wrap break-words"> 
                        {{ getFileName(video) }}
                      </div>
                  
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- VIEW FILE UPLOADED -->
          <!-- VIEW FILE UPLOADED -->
        </div>
        <!--  Content WRAPPER -->
        <!--  Content WRAPPER -->
        <!-- Open the modal using ID.showModal() method -->
        <!-- <button class="btn" onclick="my_modal_1.showModal()">open modal</button> -->
        <dialog id="deleteFileModal" class="modal">
          <div class="modal-box">
            <h3 class="text-lg font-bold">Are you sure to delete this file?</h3>
            <p class="py-4">Filename: {{ fileNameToDelete }}</p>
            <div class="modal-action">
              <form method="dialog">
                <!-- if there is a button in form, it will close the modal -->
                <button class="btn">No</button>
                <button class="btn btn-error" @click="deleteFiles()">Yes</button>
              </form>
            </div>
          </div>
        </dialog>
      </div>
    </div>
    <!-- END DIV -->
  </div>
</template>

<style scoped>
#file-input {
  display: none;
}
label {
  font-weight: 600;
  color: rgb(115, 113, 238);
}
</style>