import java.io.FileWriter;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

public class DataExporter {
    public static void main(String[] args) throws IOException {
        StringBuilder sb = new StringBuilder();
        sb.append("window.TOPICS_DATA = {\n");
        String[] topics = {"ArrayList", "LinkedList", "HashSet", "TreeSet", "HashMap", "Java Streams"};
        int[] ids = {1, 2, 3, 4, 5, 6};
        
        for (int t = 0; t < topics.length; t++) {
            var tc = JavaCollectionsMasteryCLI.MasteryRepository.getTopic(ids[t]);
            String key = topics[t].equals("Java Streams") ? "Streams" : topics[t];
            sb.append("  \"").append(key).append("\": ");
            sb.append(topicToJson(tc));
            if (t < topics.length - 1) sb.append(",\n");
        }
        sb.append("\n};\n");

        FileWriter fw = new FileWriter("topicsData.js");
        fw.write(sb.toString());
        fw.close();
        System.out.println("Exported topicsData.js successfully!");
    }

    private static String topicToJson(JavaCollectionsMasteryCLI.TopicContent tc) {
        StringBuilder sb = new StringBuilder();
        sb.append("{");
        sb.append("\"id\":").append(tc.id()).append(",");
        sb.append("\"title\":\"").append(escape(tc.title())).append("\",");
        sb.append("\"mindMap\":\"").append(escape(tc.topicMindMap())).append("\",");

        var arch = tc.explanation().architectureOverview();
        sb.append("\"architecture\":{");
        sb.append("\"definition\":\"").append(escape(arch.definition())).append("\",");
        sb.append("\"coreArchitecture\":\"").append(escape(arch.coreArchitecture())).append("\",");
        sb.append("\"basicSyntax\":\"").append(escape(arch.basicSyntax())).append("\",");
        sb.append("\"keyPoints\":[").append(arch.keyPoints().stream().map(s -> "\"" + escape(s) + "\"").collect(Collectors.joining(","))).append("],");
        sb.append("\"advantages\":[").append(arch.advantages().stream().map(s -> "\"" + escape(s) + "\"").collect(Collectors.joining(","))).append("],");
        sb.append("\"disadvantages\":[").append(arch.disadvantages().stream().map(s -> "\"" + escape(s) + "\"").collect(Collectors.joining(","))).append("]");
        sb.append("},");

        sb.append("\"operations\":[");
        for (int i = 0; i < tc.explanation().operations().size(); i++) {
            var op = tc.explanation().operations().get(i);
            sb.append("{");
            sb.append("\"name\":\"").append(escape(op.name())).append("\",");
            sb.append("\"timeComplexity\":\"").append(escape(op.timeComplexity())).append("\",");
            sb.append("\"spaceComplexity\":\"").append(escape(op.spaceComplexity())).append("\",");
            sb.append("\"syntax\":\"").append(escape(op.syntax())).append("\",");
            sb.append("\"internalWorking\":\"").append(escape(op.internalWorking())).append("\",");
            sb.append("\"mechanics\":[").append(op.keyMechanics().stream().map(s -> "\"" + escape(s) + "\"").collect(Collectors.joining(","))).append("]");
            sb.append("}").append(i < tc.explanation().operations().size() - 1 ? "," : "");
        }
        sb.append("],");

        sb.append("\"scenarios\":[");
        for (int i = 0; i < tc.realWorldScenarios().size(); i++) {
            var sc = tc.realWorldScenarios().get(i);
            sb.append("{");
            sb.append("\"domain\":\"").append(escape(sc.domain())).append("\",");
            sb.append("\"problem\":\"").append(escape(sc.problem())).append("\",");
            sb.append("\"solution\":\"").append(escape(sc.solutionRationale())).append("\"");
            sb.append("}").append(i < tc.realWorldScenarios().size() - 1 ? "," : "");
        }
        sb.append("],");

        sb.append("\"interviewQAs\":[");
        for (int i = 0; i < tc.interviewQAs().size(); i++) {
            var qa = tc.interviewQAs().get(i);
            sb.append("{");
            sb.append("\"category\":\"").append(escape(qa.companyCategory())).append("\",");
            sb.append("\"question\":\"").append(escape(qa.question())).append("\",");
            sb.append("\"answer\":\"").append(escape(qa.modelAnswer())).append("\"");
            sb.append("}").append(i < tc.interviewQAs().size() - 1 ? "," : "");
        }
        sb.append("],");

        sb.append("\"quizzes\":[");
        for (int i = 0; i < tc.quizPool().size(); i++) {
            var qz = tc.quizPool().get(i);
            sb.append("{");
            sb.append("\"difficulty\":\"").append(escape(qz.difficulty())).append("\",");
            sb.append("\"question\":\"").append(escape(qz.question())).append("\",");
            sb.append("\"options\":[").append(qz.options().stream().map(s -> "\"" + escape(s) + "\"").collect(Collectors.joining(","))).append("],");
            sb.append("\"correctOption\":\"").append(qz.correctOption()).append("\",");
            sb.append("\"explanation\":\"").append(escape(qz.explanation())).append("\"");
            sb.append("}").append(i < tc.quizPool().size() - 1 ? "," : "");
        }
        sb.append("]");

        sb.append("}");
        return sb.toString();
    }

    private static String escape(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "");
    }
}
