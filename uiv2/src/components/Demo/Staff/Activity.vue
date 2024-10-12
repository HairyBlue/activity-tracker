<template>
  <div class="mt-24">
    <h2 class="text-4xl font-bold">Activity Page</h2>
    <br />
    <div class="flex gap-4 max-md:flex-col">
      <p class="w-[800px] text-base">
        This section is the part that you will manage activities by adding, updating and delecting data
        <br />
        <span>Form Submission Activity compose of the ff:</span>
        <br />
        <span>Activity Name: </span> add name of the activity
        <br />
        <span>Activity Notes: </span> add a notes to activity (optional)
        <br />
        <span>Actitivity Start and End: </span> add date to when the activity start and ends.
        <br />
        <span>Category: </span> what type of activity being held
        <br />
        <span>Club and Organization: </span> participant of the activity
        <br />
        <span>Venue: </span> name of the place where the activity held
        <br />
        <span>Mode of Activity: </span> setting of activity happen
        <br />
        <span>Approved this Activity: </span> approving activity by selecting (Yes) or denying by selecting (No)
        <br />
        <span>Comment: </span> Leave a comment when denying activity by selecting (No)
      </p>
      <div>
        <img src="/demo/member/activity/img-1.png" alt="demo-activity-img-1" class="w-[1000px] min-w-[400px] border border-gray-400" />
        <br />
        <img src="/demo/member/activity/img-2.png" alt="demo-activity-img-2" class="w-[1000px] min-w-[400px] border border-gray-400" />
      </div>
    </div>

    <div class="mt-8 flex gap-4 max-md:flex-col">
      <p class="w-[800px] text-base">
        This section is the part that you will manage individual activity data
        <br />
        <span>In this example we select the CSPSG</span>
      </p>
      <img src="/demo/member/activity/img-3.png" alt="demo-activity-img-3" class="w-[1000px] min-w-[400px] border border-gray-400" />
    </div>

    <div class="mt-8 flex gap-4 max-md:flex-col">
      <p class="w-[800px] text-base">
        After selecting individual club and organization will redirect to this page.
        <br />
        In this section you can add documents (pdf, image and video by draging to the drag and drop section)
        <br />
      </p>

      <img src="/demo/member/activity/img-4.png" alt="demo-activity-img-4" class="w-[1000px] min-w-[400px] border border-gray-400" />
    </div>

    <div class="mt-8 flex gap-4 max-md:flex-col">
      <p class="w-[800px] text-base">
        <span>Below you can update or remove data</span>
        <br />
        Removing data also remove the file that being upload
      </p>
      <div>
        <img src="/demo/member/activity/img-5.png" alt="demo-activity-img-5" class="w-[1000px] min-w-[400px] border border-gray-400" />
        <br />
        <img src="/demo/member/activity/img-6.png" alt="demo-activity-img-6" class="w-[1000px] min-w-[400px] border border-gray-400" />
        <br />
        <img src="/demo/member/activity/img-7.png" alt="demo-activity-img-7" class="w-[1000px] min-w-[400px] border border-gray-400" />
      </div>
    </div>
  </div>
</template>

<style scoped>
span {
  font-weight: 900;
}
br {
  margin-top: 8px;
}
</style>
