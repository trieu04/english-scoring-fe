import Icons from "@/components/icons";
import { Button } from "@/components/ui/button";
import { SkillPoint } from "../components/skill-point";
import { OverallPoint } from "../components/overall-point";

export function WritingComponent() {
  return (
    <div className="px-4">
      <div className="py-3 border-b-2 border-dscl-blue1">
        <h2>Writing</h2>
      </div>
      <div className="py-4">
        <div className="flex items-center">
          <h3 className="grow">Submission</h3>
          <Button size="sm">
            <Icons.RotateCwIcon className="stroke-dscl-white" />
            <span>Re-Score</span>
          </Button>
        </div>
        <div className="mt-3 p-4 bg-dscl-line rounded-md">
          <div className="overflow-y-auto max-h-[40vh] pr-2">
            <h4 className="font-semibold ">Task 3</h4>
            <p className="mb-2">
              I believe that working from home can be more effective than working in an office, but it depends on the individual and the type of work they do. One of the main benefits of working from home is flexibility. Employees can manage their time more efficiently, reducing time spent commuting and creating a better work-life balance. Additionally, working in a comfortable home environment can increase productivity for some people.
            </p>
            <p className="mb-2">
              However, there are downsides. Working from home can lead to a lack of social interaction, which may negatively affect teamwork and communication. For jobs that require constant collaboration, being in an office can be more effective. In conclusion, while working from home offers many advantages, it is not suitable for everyone or every job. A hybrid approach might be the best solution.
            </p>
            <p className="mb-2">
              I believe that working from home can be more effective than working in an office, but it depends on the individual and the type of work they do. One of the main benefits of working from home is flexibility. Employees can manage their time more efficiently, reducing time spent commuting and creating a better work-life balance. Additionally, working in a comfortable home environment can increase productivity for some people. However, there are downsides. Working from home can lead to a lack of social interaction, which may negatively affect teamwork and communication. For jobs that require constant collaboration, being in an office can be more effective. In conclusion, while working from home offers many advantages, it is not suitable for everyone or every job. A hybrid approach might be the best solution.
            </p>
            <p className="mb-2">
              I believe that working from home can be more effective than working in an office, but it depends on the individual and the type of work they do. One of the main benefits of working from home is flexibility. Employees can manage their time more efficiently, reducing time spent commuting and creating a better work-life balance. Additionally, working in a comfortable home environment can increase
            </p>
            <p className="mb-2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <p className="mb-2">
              Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula. Donec lobortis risus a elit. Etiam tempor. Ut ullamcorper, ligula eu tempor congue, eros est euismod turpis, id tincidunt sapien risus a quam. Maecenas fermentum consequat mi. Donec fermentum. Pellentesque malesuada nulla a mi. Duis sapien sem, aliquet nec, commodo eget, consequat quis, neque. Aliquam faucibus, elit ut dictum aliquet, felis nisl adipiscing sapien, sed malesuada diam lacus eget erat.
            </p>
          </div>
        </div>
      </div>
      <div className="py-4">
        <h3>Score</h3>
        <div className="mt-3 border-1 border-dscl-main rounded-md p-4 flex justify-around">
          <OverallPoint point={9} />
          <SkillPoint icon={<Icons.LayersIcon className="stroke-dscl-main" />} name="Organization" point={9} />
          <SkillPoint icon={<Icons.BoldIcon className="stroke-dscl-main" />} name="Vocabulary" point={9} />
          <SkillPoint icon={<Icons.BookOpenIcon className="stroke-dscl-main" />} name="Grammar" point={8} />
        </div>
      </div>
      <div className="py-4">
        <h3>Explaination</h3>
        <div className="mt-3 p-4 rounded-md border border-dscl-grey1">
          <div className="overflow-y-auto max-h-[40vh] pr-2">
            <p>Tổ chức bài viết (Coherence and Organization):</p>
            <ul className="list-outside list-disc pl-6">
              <li>Điểm: 9/10</li>
              <li>Lý do: Bài viết của bạn có cấu trúc rõ ràng và mạch lạc. Bạn đã mở đầu bằng một luận điểm chính (work from home có thể hiệu quả), sau đó đưa ra các lý do ủng hộ và phản đối. Cuối cùng, bạn đã kết luận một cách hợp lý với gợi ý về giải pháp hybrid. Điểm trừ nhỏ có thể là việc có thể phát triển thêm ví dụ chi tiết cho mỗi luận điểm.</li>
            </ul>

            <p>Ngữ pháp và chính tả (Grammar and Spelling):</p>
            <ul className="list-outside list-disc pl-6">
              <li>Điểm: 9/10</li>
              <li>Lý do: Bài viết không có lỗi chính tả và rất ít lỗi ngữ pháp. Các câu đều được viết đúng ngữ pháp và dễ hiểu. Tuy nhiên, có thể sử dụng một số cấu trúc ngữ pháp phức tạp hơn để làm tăng sự phong phú và đa dạng.</li>
            </ul>

            <p>Từ vựng (Vocabulary):</p>
            <ul className="list-outside list-disc pl-6">
              <li>Điểm: 8/10</li>
              <li>Lý do: Từ vựng bạn sử dụng khá phong phú và phù hợp với chủ đề. Các thuật ngữ như "flexibility," "work-life balance," "productivity," "social interaction," "collaboration," và "hybrid approach" đều là những từ vựng phù hợp với ngữ cảnh. Tuy nhiên, bạn có thể cải thiện thêm bằng cách sử dụng nhiều từ đồng nghĩa hơn hoặc các cụm từ nâng cao để tạo sự ấn tượng mạnh hơn.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
