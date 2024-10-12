<template>
  <h2 class="text-4xl font-bold">Overview Page</h2>
  <div class="flex max-md:flex-col gap-4">
    <p class="text-base w-[800px]"> 
      <br />
      In the upper right side, there are drop-down selection to filter the result of the chart
      <br />
      <span>Approved: </span> show all the activities count that has been approved per clubs and organizations
      <br />
      <span>Pending: </span> show all the activities count that has not been approved per clubs and organizations
      <br />
      <span>School Year: </span> show all the activities with its respective school year
      <br />
      <span>School Semester: </span> show all the activities with its respective semester
      <br />
      <span>Chart type: </span> default is Barchart
      <br />
      <span>Export Excel: </span> Exporting excel file will depends on the filters that you selected
    </p>
    <div>
      <img src="/demo/member/overview/img-1.png" alt="demo-overview-img-1" class="min-w-[400px] w-[1000px] border border-gray-400"/>
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
