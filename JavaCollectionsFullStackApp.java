import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.*;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;

public class JavaCollectionsFullStackApp {

    private static final int PORT = 8080;

    // =========================================================================
    // IN-MEMORY LIVE STATE ENGINE (BACKEND MANAGED)
    // =========================================================================
    private static final List<String> liveArrayList = new ArrayList<>(List.of("Spring", "Kafka", "Docker", "Redis"));
    private static final LinkedList<String> liveLinkedList = new LinkedList<>(List.of("Head-Node", "Mid-Worker", "Tail-Sink"));
    private static final Set<String> liveHashSet = new HashSet<>(List.of("Token-A", "Token-B", "Token-C"));
    private static final NavigableSet<Integer> liveTreeSet = new TreeSet<>(List.of(10, 25, 50, 75, 100));
    private static final Map<String, Integer> liveHashMap = new LinkedHashMap<>(Map.of("USD", 100, "EUR", 92, "GBP", 78));
    private static List<Integer> liveStreamSource = new ArrayList<>(List.of(4, 12, 19, 23, 8, 42, 15, 3));

    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(PORT), 0);

        // Web Routes
        server.createContext("/", new StaticGuiHandler());
        server.createContext("/api/execute", new ApiExecutionHandler());
        server.createContext("/api/topic-data", new ApiTopicDataHandler());
        server.createContext("/api/global-data", new ApiGlobalDataHandler());

        server.setExecutor(null);
        System.out.println("=".repeat(78));
        System.out.println(" JAVA COLLECTIONS FULL-STACK SERVER STARTED (PRO EXTRA LARGE)");
        System.out.println(" Application URL: http://localhost:" + PORT);
        System.out.println("=".repeat(78));
        server.start();
    }

    // =========================================================================
    // TOPIC & GLOBAL DATA REPOSITORIES
    // =========================================================================
    public record OperationDeepDive(String name, String timeComplexity, String spaceComplexity, String syntax, String internalWorking, List<String> keyMechanics) {}
    public record ArchitectureData(String definition, String coreArchitecture, String basicSyntax, List<String> keyPoints, List<String> advantages, List<String> disadvantages) {}
    public record ExplanationData(ArchitectureData architectureOverview, List<OperationDeepDive> operations) {}
    public record RealWorldScenario(String domain, String problem, String solutionRationale) {}
    public record InterviewQA(String companyCategory, String question, String modelAnswer) {}
    public record QuizQuestion(String difficulty, String question, List<String> options, char correctOption, String explanation) {}
    public record TopicContent(int id, String title, String topicMindMap, ExplanationData explanation, List<RealWorldScenario> realWorldScenarios, List<InterviewQA> interviewQAs, List<QuizQuestion> quizPool) {}

    static class ApiTopicDataHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String query = exchange.getRequestURI().getQuery();
            String topicName = "ArrayList";
            if (query != null && query.contains("topic=")) {
                topicName = query.split("topic=")[1].split("&")[0];
            }

            TopicContent tc = getTopicContent(topicName);
            String json = topicToJson(tc);

            byte[] respBytes = json.getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
            exchange.sendResponseHeaders(200, respBytes.length);
            OutputStream os = exchange.getResponseBody();
            os.write(respBytes);
            os.close();
        }
    }

    static class ApiGlobalDataHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String query = exchange.getRequestURI().getQuery();
            String type = "mindmap";
            if (query != null && query.contains("type=")) {
                type = query.split("type=")[1].split("&")[0];
            }

            String content = switch (type.toLowerCase()) {
                case "mindmap" -> JavaCollectionsMasteryCLI.MasteryRepository.getMasterCollectionsMindMap();
                case "matrix" -> JavaCollectionsMasteryCLI.MasteryRepository.getMasterComparisonMatrix();
                case "arraylist_vs_linkedlist" -> JavaCollectionsMasteryCLI.MasteryRepository.getArrayListVsLinkedListComparison();
                case "hashset_vs_treeset" -> JavaCollectionsMasteryCLI.MasteryRepository.getHashSetVsTreeSetComparison();
                case "map_faceoff" -> JavaCollectionsMasteryCLI.MasteryRepository.getHashMapVsTreeMapVsConcurrentMapComparison();
                case "collections_vs_streams" -> JavaCollectionsMasteryCLI.MasteryRepository.getCollectionVsStreamsComparison();
                case "decision" -> JavaCollectionsMasteryCLI.MasteryRepository.getDecisionMatrixGuide();
                default -> "Content not found.";
            };

            String json = "{\"title\":\"" + escape(type) + "\",\"content\":\"" + escape(content) + "\"}";
            byte[] respBytes = json.getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
            exchange.sendResponseHeaders(200, respBytes.length);
            OutputStream os = exchange.getResponseBody();
            os.write(respBytes);
            os.close();
        }
    }

    private static TopicContent getTopicContent(String topic) {
        int id = switch (topic.toLowerCase()) {
            case "linkedlist" -> 2;
            case "hashset" -> 3;
            case "treeset" -> 4;
            case "hashmap" -> 5;
            case "streams", "javastreams", "java streams" -> 6;
            default -> 1;
        };
        var cliTopic = JavaCollectionsMasteryCLI.MasteryRepository.getTopic(id);
        
        var cliArch = cliTopic.explanation().architectureOverview();
        var arch = new ArchitectureData(cliArch.definition(), cliArch.coreArchitecture(), cliArch.basicSyntax(), cliArch.keyPoints(), cliArch.advantages(), cliArch.disadvantages());
        
        List<OperationDeepDive> ops = cliTopic.explanation().operations().stream()
            .map(o -> new OperationDeepDive(o.name(), o.timeComplexity(), o.spaceComplexity(), o.syntax(), o.internalWorking(), o.keyMechanics()))
            .toList();

        List<RealWorldScenario> scs = cliTopic.realWorldScenarios().stream()
            .map(s -> new RealWorldScenario(s.domain(), s.problem(), s.solutionRationale()))
            .toList();

        List<InterviewQA> qas = cliTopic.interviewQAs().stream()
            .map(q -> new InterviewQA(q.companyCategory(), q.question(), q.modelAnswer()))
            .toList();

        List<QuizQuestion> qz = cliTopic.quizPool().stream()
            .map(q -> new QuizQuestion(q.difficulty(), q.question(), q.options(), q.correctOption(), q.explanation()))
            .toList();

        return new TopicContent(cliTopic.id(), cliTopic.title(), cliTopic.topicMindMap(), new ExplanationData(arch, ops), scs, qas, qz);
    }

    private static String topicToJson(TopicContent tc) {
        StringBuilder sb = new StringBuilder();
        sb.append("{");
        sb.append("\"id\":").append(tc.id()).append(",");
        sb.append("\"title\":\"").append(escape(tc.title())).append("\",");
        sb.append("\"mindMap\":\"").append(escape(tc.topicMindMap())).append("\",");

        // Architecture
        var arch = tc.explanation().architectureOverview();
        sb.append("\"architecture\":{");
        sb.append("\"definition\":\"").append(escape(arch.definition())).append("\",");
        sb.append("\"coreArchitecture\":\"").append(escape(arch.coreArchitecture())).append("\",");
        sb.append("\"basicSyntax\":\"").append(escape(arch.basicSyntax())).append("\",");
        sb.append("\"keyPoints\":[").append(arch.keyPoints().stream().map(s -> "\"" + escape(s) + "\"").collect(Collectors.joining(","))).append("],");
        sb.append("\"advantages\":[").append(arch.advantages().stream().map(s -> "\"" + escape(s) + "\"").collect(Collectors.joining(","))).append("],");
        sb.append("\"disadvantages\":[").append(arch.disadvantages().stream().map(s -> "\"" + escape(s) + "\"").collect(Collectors.joining(","))).append("]");
        sb.append("},");

        // Operations
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

        // Scenarios (20)
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

        // Interview QAs (20)
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

        // Quiz Pool (20)
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

    // =========================================================================
    // REST API HANDLER & DISPATCHER FOR LIVE SANDBOX
    // =========================================================================
    static class ApiExecutionHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(405, -1);
                return;
            }

            InputStream is = exchange.getRequestBody();
            String body = new String(is.readAllBytes(), StandardCharsets.UTF_8);
            Map<String, String> params = parseJsonSimple(body);

            String topic = params.getOrDefault("topic", "");
            String action = params.getOrDefault("action", "");
            String item = params.getOrDefault("item", "");
            String key = params.getOrDefault("key", "");
            String val = params.getOrDefault("val", "");
            String idxStr = params.getOrDefault("index", "0");
            int index = 0;
            try { index = Integer.parseInt(idxStr); } catch (Exception ignored) {}

            ApiResponse res = dispatchOperation(topic, action, item, key, val, index);

            byte[] respBytes = res.toJson().getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
            exchange.sendResponseHeaders(200, respBytes.length);
            OutputStream os = exchange.getResponseBody();
            os.write(respBytes);
            os.close();
        }
    }

    private static synchronized ApiResponse dispatchOperation(String topic, String action, String item, String key, String val, int index) {
        String beforeState = "";
        String afterState = "";
        String complexity = "";
        String stdout = "";
        String opName = "";
        List<String> liveList = new ArrayList<>();

        switch (topic.toLowerCase()) {
            case "arraylist" -> {
                beforeState = liveArrayList.toString();
                switch (action) {
                    case "add" -> {
                        String payload = item.isBlank() ? "Item-" + (liveArrayList.size() + 1) : item;
                        liveArrayList.add(payload);
                        opName = "list.add(\"" + payload + "\")";
                        complexity = "Amortized O(1) [Append]";
                        stdout = "Appended item at index " + (liveArrayList.size() - 1);
                    }
                    case "insert" -> {
                        String payload = item.isBlank() ? "Inserted" : item;
                        int safeIdx = Math.max(0, Math.min(index, liveArrayList.size()));
                        liveArrayList.add(safeIdx, payload);
                        opName = "list.add(" + safeIdx + ", \"" + payload + "\")";
                        complexity = "O(n) [System.arraycopy element shift]";
                        stdout = "Inserted at index " + safeIdx;
                    }
                    case "removeIdx" -> {
                        if (index >= 0 && index < liveArrayList.size()) {
                            String rem = liveArrayList.remove(index);
                            opName = "list.remove(" + index + ")";
                            complexity = "O(n) [Left shift & nullify tail]";
                            stdout = "Removed element: \"" + rem + "\"";
                        } else {
                            stdout = "Index out of bounds!";
                            complexity = "O(1)";
                        }
                    }
                    case "removeVal" -> {
                        boolean ok = liveArrayList.remove(item);
                        opName = "list.remove(\"" + item + "\")";
                        complexity = "O(n) [Linear scan + left shift]";
                        stdout = "Removed: " + ok;
                    }
                    case "get" -> {
                        opName = "list.get(" + index + ")";
                        complexity = "O(1) [Direct Array Offset]";
                        stdout = (index >= 0 && index < liveArrayList.size()) ? "Value: \"" + liveArrayList.get(index) + "\"" : "Index out of bounds!";
                    }
                    case "sort" -> {
                        liveArrayList.sort(Comparator.naturalOrder());
                        opName = "list.sort(Comparator.naturalOrder())";
                        complexity = "O(n log n) [Dual-Pivot Timsort]";
                        stdout = "ArrayList buffer sorted in-place";
                    }
                    case "clear" -> {
                        liveArrayList.clear();
                        opName = "list.clear()";
                        complexity = "O(n) [Nullifies backing buffer]";
                        stdout = "ArrayList cleared";
                    }
                    case "sample" -> {
                        liveArrayList.clear();
                        liveArrayList.addAll(List.of("Microservice", "Cloud", "Kubernetes", "DevOps", "Database"));
                        opName = "list.addAll(samples)";
                        complexity = "O(k)";
                        stdout = "Loaded sample production stack";
                    }
                }
                afterState = liveArrayList.toString();
                liveList.addAll(liveArrayList);
            }
            case "linkedlist" -> {
                beforeState = liveLinkedList.toString();
                switch (action) {
                    case "addFirst" -> {
                        String payload = item.isBlank() ? "Head-" + (liveLinkedList.size() + 1) : item;
                        liveLinkedList.addFirst(payload);
                        opName = "list.addFirst(\"" + payload + "\")";
                        complexity = "O(1) [linkFirst pointer rewire]";
                        stdout = "Head pointer updated to " + payload;
                    }
                    case "addLast" -> {
                        String payload = item.isBlank() ? "Tail-" + (liveLinkedList.size() + 1) : item;
                        liveLinkedList.addLast(payload);
                        opName = "list.addLast(\"" + payload + "\")";
                        complexity = "O(1) [linkLast pointer rewire]";
                        stdout = "Tail pointer updated to " + payload;
                    }
                    case "removeFirst" -> {
                        opName = "list.removeFirst()";
                        complexity = "O(1) [unlinkFirst]";
                        stdout = liveLinkedList.isEmpty() ? "List empty" : "Detached: \"" + liveLinkedList.removeFirst() + "\"";
                    }
                    case "removeLast" -> {
                        opName = "list.removeLast()";
                        complexity = "O(1) [unlinkLast]";
                        stdout = liveLinkedList.isEmpty() ? "List empty" : "Detached: \"" + liveLinkedList.removeLast() + "\"";
                    }
                    case "peek" -> {
                        opName = "list.peekFirst()";
                        complexity = "O(1) [Direct Head Reference]";
                        stdout = "Head Node: \"" + (liveLinkedList.peekFirst() != null ? liveLinkedList.peekFirst() : "null") + "\"";
                    }
                    case "sort" -> {
                        liveLinkedList.sort(Comparator.naturalOrder());
                        opName = "list.sort(naturalOrder())";
                        complexity = "O(n log n) [toArray() -> Timsort -> Relink]";
                        stdout = "LinkedList nodes sorted";
                    }
                    case "clear" -> {
                        liveLinkedList.clear();
                        opName = "list.clear()";
                        complexity = "O(n) [Unlinks all nodes for GC]";
                        stdout = "LinkedList cleared";
                    }
                    case "sample" -> {
                        liveLinkedList.clear();
                        liveLinkedList.addAll(List.of("Req-Ingest", "Auth-Token", "Rate-Limiter", "Response-Sink"));
                        opName = "list.addAll(samples)";
                        complexity = "O(k)";
                        stdout = "Loaded pipeline nodes";
                    }
                }
                afterState = liveLinkedList.toString();
                liveList.addAll(liveLinkedList);
            }
            case "hashset" -> {
                beforeState = liveHashSet.toString();
                switch (action) {
                    case "add" -> {
                        String payload = item.isBlank() ? "Token-" + (liveHashSet.size() + 1) : item;
                        boolean added = liveHashSet.add(payload);
                        opName = "set.add(\"" + payload + "\")";
                        complexity = "O(1) Avg [Bitmask index (n-1)&hash]";
                        stdout = "Returned: " + added + (added ? " (Stored in bucket)" : " (Duplicate Rejected)");
                    }
                    case "remove" -> {
                        boolean ok = liveHashSet.remove(item);
                        opName = "set.remove(\"" + item + "\")";
                        complexity = "O(1) Avg [Bucket lookup & unlink]";
                        stdout = "Returned: " + ok;
                    }
                    case "contains" -> {
                        boolean has = liveHashSet.contains(item);
                        opName = "set.contains(\"" + item + "\")";
                        complexity = "O(1) Avg [hashCode() + equals()]";
                        stdout = "Membership check: " + has;
                    }
                    case "sort" -> {
                        List<String> sorted = new ArrayList<>(liveHashSet);
                        Collections.sort(sorted);
                        opName = "Collections.sort(new ArrayList<>(set))";
                        complexity = "O(n log n) [External Array Sort]";
                        stdout = "Sorted Export: " + sorted;
                    }
                    case "clear" -> {
                        liveHashSet.clear();
                        opName = "set.clear()";
                        complexity = "O(capacity) [Nullifies hash table buckets]";
                        stdout = "HashSet cleared";
                    }
                    case "sample" -> {
                        liveHashSet.clear();
                        liveHashSet.addAll(List.of("JWT_ADMIN", "SESSION_X92", "SESSION_K41", "API_KEY_LIVE"));
                        opName = "set.addAll(tokens)";
                        complexity = "O(k)";
                        stdout = "Loaded unique token set";
                    }
                }
                afterState = liveHashSet.toString();
                liveList.addAll(liveHashSet);
            }
            case "treeset" -> {
                beforeState = liveTreeSet.toString();
                int num = 0;
                try { num = Integer.parseInt(item); } catch (Exception ignored) {}
                switch (action) {
                    case "add" -> {
                        if (item.isBlank()) num = (int)(Math.random() * 90 + 10);
                        boolean added = liveTreeSet.add(num);
                        opName = "treeSet.add(" + num + ")";
                        complexity = "O(log n) [BST insertion & color-fix]";
                        stdout = "Returned: " + added + (added ? " (Node attached)" : " (Duplicate rejected: compareTo == 0)");
                    }
                    case "remove" -> {
                        boolean ok = liveTreeSet.remove(num);
                        opName = "treeSet.remove(" + num + ")";
                        complexity = "O(log n) [Successor replacement & balance]";
                        stdout = "Returned: " + ok;
                    }
                    case "floor" -> {
                        opName = "treeSet.floor(" + num + ")";
                        complexity = "O(log n) [Branch boundary search]";
                        stdout = "Greatest element <= " + num + ": " + liveTreeSet.floor(num);
                    }
                    case "ceiling" -> {
                        opName = "treeSet.ceiling(" + num + ")";
                        complexity = "O(log n) [Branch boundary search]";
                        stdout = "Least element >= " + num + ": " + liveTreeSet.ceiling(num);
                    }
                    case "clear" -> {
                        liveTreeSet.clear();
                        opName = "treeSet.clear()";
                        complexity = "O(n) [Unlinks Red-Black Tree]";
                        stdout = "TreeSet cleared";
                    }
                    case "sample" -> {
                        liveTreeSet.clear();
                        liveTreeSet.addAll(List.of(15, 30, 45, 60, 90, 120));
                        opName = "treeSet.addAll(sortedNumbers)";
                        complexity = "O(k log n)";
                        stdout = "Loaded balanced range set";
                    }
                }
                afterState = liveTreeSet.toString();
                for (Integer i : liveTreeSet) liveList.add(String.valueOf(i));
            }
            case "hashmap" -> {
                beforeState = liveHashMap.toString();
                int mapVal = 0;
                try { mapVal = Integer.parseInt(val); } catch (Exception ignored) {}
                switch (action) {
                    case "put" -> {
                        String k = key.isBlank() ? "KEY_" + (liveHashMap.size() + 1) : key;
                        int v = val.isBlank() ? (int)(Math.random() * 500 + 10) : mapVal;
                        Integer old = liveHashMap.put(k, v);
                        opName = "map.put(\"" + k + "\", " + v + ")";
                        complexity = "O(1) Avg [Bitmask index (n-1)&hash]";
                        stdout = "Previous Value: " + old + (old == null ? " (New Key Assigned)" : " (Value Updated)");
                    }
                    case "remove" -> {
                        Integer old = liveHashMap.remove(key);
                        opName = "map.remove(\"" + key + "\")";
                        complexity = "O(1) Avg [Bucket lookup + node detachment]";
                        stdout = "Removed Value: " + old;
                    }
                    case "get" -> {
                        opName = "map.get(\"" + key + "\")";
                        complexity = "O(1) Avg [Key Bitmask]";
                        stdout = "Value: " + liveHashMap.get(key);
                    }
                    case "sort" -> {
                        Map<String, Integer> sorted = new TreeMap<>(liveHashMap);
                        opName = "TreeMap<>(map)";
                        complexity = "O(n log n) [Red-Black Key Sort]";
                        stdout = "Sorted Keys: " + sorted;
                    }
                    case "clear" -> {
                        liveHashMap.clear();
                        opName = "map.clear()";
                        complexity = "O(capacity) [Nullifies table bins]";
                        stdout = "HashMap cleared";
                    }
                    case "sample" -> {
                        liveHashMap.clear();
                        liveHashMap.putAll(Map.of("AWS_CPU", 42, "MEM_GB", 64, "LATENCY_MS", 12, "QPS_K", 180));
                        opName = "map.putAll(telemetry)";
                        complexity = "O(k)";
                        stdout = "Loaded system telemetry map";
                    }
                }
                afterState = liveHashMap.toString();
                liveHashMap.forEach((k, v) -> liveList.add(k + " : " + v));
            }
            case "streams" -> {
                beforeState = liveStreamSource.toString();
                switch (action) {
                    case "init" -> {
                        String src = item.isBlank() ? "10, 20, 30, 40, 50" : item;
                        liveStreamSource = Arrays.stream(src.split("[,\\s]+"))
                                .filter(s -> !s.isBlank())
                                .map(Integer::parseInt)
                                .collect(Collectors.toList());
                        opName = "Arrays.stream(...)";
                        complexity = "O(1) [Spliterator Initialization]";
                        stdout = "Stream Source Loaded: " + liveStreamSource;
                    }
                    case "filter" -> {
                        int threshold = index;
                        List<Integer> res = liveStreamSource.stream().filter(n -> n > threshold).toList();
                        opName = "stream().filter(n -> n > " + threshold + ").toList()";
                        complexity = "O(n) [Stateless Intermediate Pipeline]";
                        stdout = "Pipeline Result: " + res;
                    }
                    case "map" -> {
                        int multiplier = 2;
                        List<Integer> res = liveStreamSource.stream().map(n -> n * multiplier).toList();
                        opName = "stream().map(n -> n * 2).toList()";
                        complexity = "O(n) [Lazy Element Transformation]";
                        stdout = "Pipeline Result: " + res;
                    }
                    case "sorted" -> {
                        List<Integer> res = liveStreamSource.stream().sorted().toList();
                        opName = "stream().sorted().toList()";
                        complexity = "O(n log n) [Stateful Intermediate Barrier]";
                        stdout = "Pipeline Result: " + res;
                    }
                    case "findFirst" -> {
                        Optional<Integer> res = liveStreamSource.stream().findFirst();
                        opName = "stream().findFirst()";
                        complexity = "O(1) [Short-Circuit Evaluation]";
                        stdout = "First Element: " + res.orElse(null);
                    }
                    case "clear" -> {
                        liveStreamSource.clear();
                        opName = "liveStreamSource.clear()";
                        complexity = "O(1)";
                        stdout = "Stream source reset";
                    }
                    case "sample" -> {
                        liveStreamSource = new ArrayList<>(List.of(9, 45, 12, 88, 3, 67, 24, 18));
                        opName = "Arrays.asList(9, 45, ...)";
                        complexity = "O(k)";
                        stdout = "Loaded stream telemetry numbers";
                    }
                }
                afterState = liveStreamSource.toString();
                for (Integer i : liveStreamSource) liveList.add(String.valueOf(i));
            }
        }

        return new ApiResponse(opName, complexity, beforeState, afterState, stdout, liveList);
    }

    record ApiResponse(String op, String complexity, String before, String after, String stdout, List<String> items) {
        public String toJson() {
            StringBuilder sb = new StringBuilder();
            sb.append("{");
            sb.append("\"op\":").append(quote(op)).append(",");
            sb.append("\"complexity\":").append(quote(complexity)).append(",");
            sb.append("\"before\":").append(quote(before)).append(",");
            sb.append("\"after\":").append(quote(after)).append(",");
            sb.append("\"stdout\":").append(quote(stdout)).append(",");
            sb.append("\"items\":[");
            for (int i = 0; i < items.size(); i++) {
                sb.append(quote(items.get(i)));
                if (i < items.size() - 1) sb.append(",");
            }
            sb.append("]}");
            return sb.toString();
        }

        private String quote(String s) {
            if (s == null) return "\"\"";
            return "\"" + s.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n") + "\"";
        }
    }

    private static Map<String, String> parseJsonSimple(String body) {
        Map<String, String> map = new HashMap<>();
        if (body == null || body.isBlank()) return map;
        String clean = body.replaceAll("[{}\"]", "").trim();
        String[] pairs = clean.split(",");
        for (String pair : pairs) {
            String[] kv = pair.split(":", 2);
            if (kv.length == 2) {
                map.put(kv[0].trim(), kv[1].trim());
            }
        }
        return map;
    }

    // =========================================================================
    // EMBEDDED FRONTEND (HTML / CSS / JS) - EXTRA LARGE TYPOGRAPHY
    // =========================================================================
    static class StaticGuiHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            byte[] response = HTML_PAGE.getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().set("Content-Type", "text/html; charset=UTF-8");
            exchange.sendResponseHeaders(200, response.length);
            OutputStream os = exchange.getResponseBody();
            os.write(response);
            os.close();
        }
    }

    private static final String HTML_PAGE = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Java Collections & Streams Mastery Hub</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
        <style>
            :root {
                --base-font-size: 18px;
                --bg-main: #0b0f19;
                --bg-sidebar: #0f172a;
                --bg-card: #1e293b;
                --bg-card-elevated: #243044;
                --bg-input: #0b1120;
                --border: rgba(255, 255, 255, 0.1);
                --border-focus: #38bdf8;
                
                --text-main: #f8fafc;
                --text-muted: #a0aec0;
                --text-dim: #718096;
                
                --cyan: #38bdf8;
                --blue: #3b82f6;
                --emerald: #10b981;
                --emerald-bg: rgba(16, 185, 129, 0.18);
                --amber: #f59e0b;
                --amber-bg: rgba(245, 158, 11, 0.18);
                --rose: #f43f5e;
                --rose-bg: rgba(244, 63, 94, 0.18);
                --indigo: #818cf8;
                --purple: #c084fc;
                
                --font-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
                --font-mono: 'Fira Code', Consolas, monospace;
                
                --shadow-sm: 0 2px 10px rgba(0, 0, 0, 0.3);
                --shadow-md: 0 10px 30px rgba(0, 0, 0, 0.5);
                --shadow-lg: 0 20px 45px -10px rgba(0, 0, 0, 0.7);
            }
            
            * { box-sizing: border-box; margin: 0; padding: 0; font-family: var(--font-sans); }
            html { font-size: var(--base-font-size); }
            body { background: var(--bg-main); color: var(--text-main); height: 100vh; overflow: hidden; display: flex; }
            
            /* SCROLLBAR */
            ::-webkit-scrollbar { width: 9px; height: 9px; }
            ::-webkit-scrollbar-track { background: transparent; }
            ::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.22); border-radius: 5px; }
            ::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.35); }

            /* SIDEBAR */
            aside {
                width: 350px;
                background: var(--bg-sidebar);
                border-right: 1px solid var(--border);
                display: flex;
                flex-direction: column;
                flex-shrink: 0;
                user-select: none;
            }
            
            .brand-box {
                padding: 26px 26px;
                display: flex;
                align-items: center;
                gap: 16px;
                border-bottom: 1px solid var(--border);
                background: linear-gradient(180deg, rgba(56, 189, 248, 0.12), transparent);
            }
            .brand-icon {
                width: 48px;
                height: 48px;
                background: linear-gradient(135deg, #38bdf8, #3b82f6);
                border-radius: 13px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 800;
                color: #fff;
                font-size: 1.5rem;
                box-shadow: 0 6px 20px rgba(56, 189, 248, 0.45);
            }
            .brand-text h1 { font-size: 1.25rem; font-weight: 800; color: #fff; line-height: 1.2; }
            .brand-text p { font-size: 0.9rem; color: var(--text-muted); margin-top: 3px; }

            .nav-container { flex-grow: 1; overflow-y: auto; padding: 20px 16px; }
            .nav-group-title {
                font-size: 0.82rem;
                font-weight: 800;
                text-transform: uppercase;
                letter-spacing: 0.08em;
                color: var(--text-dim);
                padding: 16px 12px 8px;
            }
            .nav-item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 13px 16px;
                border-radius: 10px;
                color: var(--text-muted);
                font-size: 1.05rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.15s ease;
                margin-bottom: 4px;
            }
            .nav-item:hover { background: rgba(255, 255, 255, 0.08); color: #fff; transform: translateX(3px); }
            .nav-item.active {
                background: rgba(56, 189, 248, 0.18);
                color: var(--cyan);
                border: 1px solid rgba(56, 189, 248, 0.4);
                font-weight: 700;
            }
            .nav-badge {
                font-size: 0.8rem;
                font-weight: 700;
                padding: 3px 10px;
                border-radius: 6px;
                background: rgba(255, 255, 255, 0.1);
                color: var(--text-muted);
            }
            .nav-item.active .nav-badge { background: rgba(56, 189, 248, 0.3); color: var(--cyan); }

            /* MAIN WRAPPER */
            main { flex-grow: 1; display: flex; flex-direction: column; overflow: hidden; background: var(--bg-main); }
            
            /* HEADER */
            header {
                height: 82px;
                background: rgba(15, 23, 42, 0.9);
                backdrop-filter: blur(16px);
                border-bottom: 1px solid var(--border);
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 36px;
                z-index: 10;
            }
            .header-title-box { display: flex; align-items: center; gap: 16px; }
            .header-title { font-size: 1.6rem; font-weight: 800; color: #fff; letter-spacing: -0.02em; }
            .header-tag {
                font-size: 0.85rem;
                font-weight: 700;
                padding: 4px 14px;
                border-radius: 8px;
                background: var(--emerald-bg);
                color: var(--emerald);
                border: 1px solid rgba(16, 185, 129, 0.4);
            }

            .header-controls { display: flex; align-items: center; gap: 12px; }
            .font-scaler {
                display: flex;
                background: rgba(0, 0, 0, 0.35);
                padding: 4px;
                border-radius: 8px;
                border: 1px solid var(--border);
                gap: 2px;
            }
            .font-btn {
                background: transparent;
                border: none;
                color: var(--text-muted);
                padding: 6px 10px;
                font-size: 0.85rem;
                font-weight: 700;
                border-radius: 6px;
                cursor: pointer;
            }
            .font-btn:hover { color: #fff; }
            .font-btn.active { background: var(--bg-card-elevated); color: var(--cyan); }

            .tab-nav { display: flex; gap: 6px; background: rgba(0, 0, 0, 0.35); padding: 6px; border-radius: 12px; border: 1px solid var(--border); }
            .tab-btn {
                background: transparent;
                border: none;
                color: var(--text-muted);
                padding: 10px 20px;
                font-size: 1.02rem;
                font-weight: 600;
                border-radius: 8px;
                cursor: pointer;
                transition: 0.15s ease;
            }
            .tab-btn:hover { color: #fff; }
            .tab-btn.active {
                background: var(--bg-card-elevated);
                color: var(--cyan);
                box-shadow: var(--shadow-sm);
                font-weight: 700;
            }

            /* CONTENT AREA */
            .main-content {
                flex-grow: 1;
                overflow-y: auto;
                padding: 32px 38px;
            }

            /* PLAYGROUND GRID */
            .play-grid {
                display: grid;
                grid-template-columns: 440px 1fr;
                gap: 28px;
                height: calc(100vh - 146px);
            }
            .card-panel {
                background: var(--bg-card);
                border: 1px solid var(--border);
                border-radius: 16px;
                padding: 26px;
                display: flex;
                flex-direction: column;
                box-shadow: var(--shadow-md);
                overflow: hidden;
            }
            .panel-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 1.15rem;
                font-weight: 700;
                color: var(--cyan);
                padding-bottom: 16px;
                border-bottom: 1px solid var(--border);
                margin-bottom: 20px;
            }
            .panel-header-actions { display: flex; gap: 10px; }

            .input-group { margin-bottom: 18px; }
            .input-label { display: block; font-size: 0.92rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 8px; letter-spacing: 0.04em; }
            .input-field {
                width: 100%;
                background: var(--bg-input);
                border: 1px solid var(--border);
                padding: 14px 16px;
                border-radius: 10px;
                color: #fff;
                font-size: 1.08rem;
                font-family: var(--font-mono);
                outline: none;
                transition: 0.2s;
            }
            .input-field:focus { border-color: var(--cyan); box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.3); }

            .ctrl-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 16px; }
            .btn-action {
                background: var(--bg-card-elevated);
                border: 1px solid var(--border);
                color: #fff;
                padding: 13px 16px;
                border-radius: 10px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.15s;
                text-align: center;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }
            .btn-action:hover { background: var(--cyan); color: #000; border-color: var(--cyan); font-weight: 700; transform: translateY(-1px); }
            .btn-danger { color: #fda4af; }
            .btn-danger:hover { background: var(--rose); color: #fff; border-color: var(--rose); font-weight: 700; }
            .btn-sm { padding: 8px 14px; font-size: 0.88rem; border-radius: 8px; }

            /* VISUAL MEMORY RENDERER */
            .memory-canvas {
                background: var(--bg-input);
                border: 1px solid var(--border);
                border-radius: 14px;
                padding: 22px;
                min-height: 160px;
                max-height: 220px;
                display: flex;
                flex-wrap: wrap;
                gap: 12px;
                align-items: center;
                align-content: flex-start;
                overflow-y: auto;
                margin-bottom: 20px;
            }
            .mem-node {
                background: var(--bg-card);
                border: 1px solid rgba(56, 189, 248, 0.5);
                border-radius: 10px;
                padding: 10px 18px;
                font-family: var(--font-mono);
                font-size: 1.08rem;
                color: #fff;
                display: flex;
                align-items: center;
                gap: 12px;
                box-shadow: var(--shadow-sm);
                animation: popNode 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            @keyframes popNode { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: scale(1); } }
            .mem-idx { color: var(--cyan); font-weight: 700; font-size: 0.9rem; padding-right: 10px; border-right: 1px solid var(--border); }

            /* TELEMETRY CONSOLE */
            .telemetry-card {
                flex-grow: 1;
                background: #050811;
                border: 1px solid var(--border);
                border-radius: 12px;
                padding: 20px;
                font-family: var(--font-mono);
                font-size: 1rem;
                line-height: 1.65;
                color: #a7f3d0;
                overflow-y: auto;
                white-space: pre-wrap;
            }

            /* ARCHITECTURE CARDS */
            .arch-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; }
            .info-card {
                background: var(--bg-card);
                border: 1px solid var(--border);
                border-radius: 14px;
                padding: 26px;
                box-shadow: var(--shadow-sm);
            }
            .info-title { font-size: 1.2rem; font-weight: 700; color: var(--cyan); margin-bottom: 14px; display: flex; align-items: center; gap: 12px; }
            .info-text { font-size: 1.08rem; color: #cbd5e1; line-height: 1.75; }

            .feature-list { list-style: none; }
            .feature-list li { padding: 8px 0; font-size: 1.08rem; display: flex; align-items: flex-start; gap: 12px; line-height: 1.65; }
            .feature-list li.pro { color: #a7f3d0; }
            .feature-list li.con { color: #fecdd3; }

            /* OPERATIONS DEEP DIVE */
            .op-box {
                background: var(--bg-card);
                border: 1px solid var(--border);
                border-radius: 14px;
                padding: 26px;
                margin-bottom: 22px;
            }
            .op-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
            .op-name { font-size: 1.25rem; font-weight: 700; color: #fff; }
            .op-badge-group { display: flex; gap: 10px; }
            .badge-pill {
                font-size: 0.9rem;
                font-weight: 700;
                font-family: var(--font-mono);
                padding: 5px 12px;
                border-radius: 7px;
                background: rgba(255, 255, 255, 0.1);
                color: var(--cyan);
            }

            /* SCENARIO GRID */
            .scenarios-container { display: grid; grid-template-columns: repeat(auto-fill, minmax(480px, 1fr)); gap: 20px; }
            .sc-card {
                background: var(--bg-card);
                border: 1px solid var(--border);
                border-radius: 14px;
                padding: 24px;
                transition: transform 0.15s ease, border-color 0.15s ease;
            }
            .sc-card:hover { transform: translateY(-2px); border-color: rgba(56, 189, 248, 0.45); }
            .sc-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
            .sc-title { font-size: 1.15rem; font-weight: 700; color: #fff; }
            .sc-badge { font-size: 0.82rem; font-weight: 700; padding: 4px 10px; border-radius: 6px; background: rgba(192, 132, 252, 0.2); color: var(--purple); }

            /* INTERVIEW Q&A */
            .qa-card {
                background: var(--bg-card);
                border: 1px solid var(--border);
                border-radius: 14px;
                padding: 24px 26px;
                margin-bottom: 18px;
            }
            .qa-tier { font-size: 0.82rem; font-weight: 800; padding: 4px 10px; border-radius: 6px; text-transform: uppercase; margin-bottom: 10px; display: inline-block; }
            .qa-tier-service { background: var(--blue); color: #fff; }
            .qa-tier-product { background: var(--purple); color: #fff; }
            .qa-question { font-size: 1.18rem; font-weight: 700; color: #fff; margin-bottom: 10px; }

            /* QUIZ */
            .quiz-head-bar {
                background: var(--bg-card);
                border: 1px solid var(--border);
                border-radius: 14px;
                padding: 22px 28px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 24px;
            }
            .quiz-card {
                background: var(--bg-card);
                border: 1px solid var(--border);
                border-radius: 14px;
                padding: 26px;
                margin-bottom: 22px;
            }
            .quiz-options { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 18px 0 12px; }
            .quiz-opt {
                background: var(--bg-card-elevated);
                border: 1px solid var(--border);
                color: #cbd5e1;
                padding: 15px 18px;
                border-radius: 10px;
                font-size: 1.05rem;
                font-weight: 500;
                cursor: pointer;
                text-align: left;
                transition: 0.15s;
                line-height: 1.45;
            }
            .quiz-opt:hover { background: rgba(255, 255, 255, 0.12); color: #fff; }
            .quiz-opt.correct { background: var(--emerald-bg) !important; border-color: var(--emerald) !important; color: #fff !important; font-weight: 700; }
            .quiz-opt.wrong { background: var(--rose-bg) !important; border-color: var(--rose) !important; color: #fff !important; }
            .quiz-exp {
                background: #060911;
                border-left: 4px solid var(--cyan);
                padding: 14px 18px;
                font-size: 1rem;
                color: #a0aec0;
                border-radius: 0 10px 10px 0;
                margin-top: 12px;
                display: none;
                line-height: 1.6;
            }

            pre {
                background: #060911;
                border: 1px solid var(--border);
                padding: 20px;
                border-radius: 12px;
                font-family: var(--font-mono);
                font-size: 1.02rem;
                color: #e2e8f0;
                overflow-x: auto;
                line-height: 1.6;
            }
        </style>
    </head>
    <body>
        <!-- SIDEBAR -->
        <aside>
            <div class="brand-box">
                <div class="brand-icon">&#9749;</div>
                <div class="brand-text">
                    <h1>Java Collections</h1>
                    <p>Mastery & Architecture Hub</p>
                </div>
            </div>
            <div class="nav-container">
                <div class="nav-group-title">Data Structures</div>
                <div class="nav-item active" onclick="switchTopic('ArrayList')">
                    <span>ArrayList</span> <span class="nav-badge">List</span>
                </div>
                <div class="nav-item" onclick="switchTopic('LinkedList')">
                    <span>LinkedList</span> <span class="nav-badge">Deque</span>
                </div>
                <div class="nav-item" onclick="switchTopic('HashSet')">
                    <span>HashSet</span> <span class="nav-badge">Set</span>
                </div>
                <div class="nav-item" onclick="switchTopic('TreeSet')">
                    <span>TreeSet</span> <span class="nav-badge">BST</span>
                </div>
                <div class="nav-item" onclick="switchTopic('HashMap')">
                    <span>HashMap</span> <span class="nav-badge">Map</span>
                </div>
                <div class="nav-item" onclick="switchTopic('Streams')">
                    <span>Java Streams</span> <span class="nav-badge">Lazy</span>
                </div>

                <div class="nav-group-title">Comparative Analysis</div>
                <div class="nav-item" onclick="switchGlobal('mindmap', 'Global Hierarchy Mind Map')">
                    <span>Master Mind Map</span>
                </div>
                <div class="nav-item" onclick="switchGlobal('matrix', 'Master Comparison Matrix')">
                    <span>Comparison Matrix</span>
                </div>
                <div class="nav-item" onclick="switchGlobal('arraylist_vs_linkedlist', 'Face-Off: ArrayList vs LinkedList')">
                    <span>ArrayList vs LinkedList</span>
                </div>
                <div class="nav-item" onclick="switchGlobal('hashset_vs_treeset', 'Face-Off: HashSet vs TreeSet')">
                    <span>HashSet vs TreeSet</span>
                </div>
                <div class="nav-item" onclick="switchGlobal('map_faceoff', 'Face-Off: Map Implementations')">
                    <span>Map Face-Off</span>
                </div>
                <div class="nav-item" onclick="switchGlobal('collections_vs_streams', 'Face-Off: Collections vs Streams')">
                    <span>Collections vs Streams</span>
                </div>
                <div class="nav-item" onclick="switchGlobal('decision', 'Architectural Decision Matrix')">
                    <span>Decision Guide</span>
                </div>
            </div>
        </aside>

        <!-- MAIN APP -->
        <main>
            <header>
                <div class="header-title-box">
                    <span class="header-title" id="displayTopicTitle">ArrayList Mastery Module</span>
                    <span class="header-tag">Live Engine</span>
                </div>
                <div class="header-controls">
                    <div class="font-scaler">
                        <button class="font-btn" onclick="setFontScale(16, this)">A Standard</button>
                        <button class="font-btn active" onclick="setFontScale(18, this)">A+ Large</button>
                        <button class="font-btn" onclick="setFontScale(21, this)">A++ XL</button>
                    </div>
                    <div class="tab-nav" id="tabBar">
                        <button class="tab-btn active" onclick="switchTab('playground')">Live Sandbox</button>
                        <button class="tab-btn" onclick="switchTab('architecture')">Deep Architecture</button>
                        <button class="tab-btn" onclick="switchTab('operations')">Operations</button>
                        <button class="tab-btn" onclick="switchTab('scenarios')">20 Scenarios</button>
                        <button class="tab-btn" onclick="switchTab('interview')">Interview Q&A</button>
                        <button class="tab-btn" onclick="switchTab('quiz')">Mastery Quiz</button>
                    </div>
                </div>
            </header>

            <div class="main-content" id="contentBody"></div>
        </main>

        <script>
            let currentTopic = 'ArrayList';
            let currentTab = 'playground';
            let currentTopicData = null;
            let quizScore = 0;
            let answeredCount = 0;

            function setFontScale(px, btn) {
                document.documentElement.style.setProperty('--base-font-size', px + 'px');
                document.querySelectorAll('.font-btn').forEach(b => b.classList.remove('active'));
                if (btn) btn.classList.add('active');
            }

            async function switchTopic(topic) {
                currentTopic = topic;
                document.querySelectorAll('.nav-item').forEach(el => {
                    el.classList.toggle('active', el.innerText.trim().startsWith(topic));
                });
                document.getElementById('tabBar').style.display = 'flex';
                document.getElementById('displayTopicTitle').innerText = topic + " Mastery Module";
                
                const res = await fetch(`/api/topic-data?topic=${encodeURIComponent(topic)}`);
                currentTopicData = await res.json();
                quizScore = 0;
                answeredCount = 0;
                renderView();
            }

            function switchTab(tab) {
                currentTab = tab;
                document.querySelectorAll('.tab-btn').forEach(el => {
                    el.classList.toggle('active', el.innerText.toLowerCase().includes(tab.substring(0, 4)));
                });
                renderView();
            }

            function renderView() {
                const container = document.getElementById('contentBody');
                if (!currentTopicData && currentTab !== 'playground') {
                    container.innerHTML = '<div style="color:var(--text-muted); padding:20px; font-size: 1.15rem;">Fetching module data...</div>';
                    return;
                }

                if (currentTab === 'playground') {
                    container.innerHTML = `
                        <div class="play-grid">
                            <div class="card-panel">
                                <div class="panel-header">
                                    <span>Interactive Sandbox Controls</span>
                                    <div class="panel-header-actions">
                                        <button class="btn-action btn-sm" onclick="callApi('sample')">Load Sample</button>
                                        <button class="btn-action btn-danger btn-sm" onclick="callApi('clear')">Clear</button>
                                    </div>
                                </div>
                                <div id="dynamicControls"></div>
                            </div>
                            <div class="card-panel">
                                <div class="panel-header">
                                    <span>Live In-Memory State Visualization</span>
                                    <span style="font-size:0.85rem; color:var(--text-dim);">JVM Backed</span>
                                </div>
                                <div class="memory-canvas" id="visualContainer">
                                    <span style="color: var(--text-dim); font-size: 1rem;">[Loading collection state...]</span>
                                </div>
                                <div class="panel-header" style="margin-top: 14px;">
                                    <span>Server Telemetry & Complexity Stream</span>
                                </div>
                                <div class="telemetry-card" id="sandboxConsole">Ready for execution. Dispatches directly to embedded Java HttpServer.</div>
                            </div>
                        </div>
                    `;
                    buildControls();
                    callApi('peek'); // initial populate
                } else if (currentTab === 'architecture') {
                    const arch = currentTopicData.architecture;
                    container.innerHTML = `
                        <div class="arch-grid">
                            <div class="info-card">
                                <div class="info-title">&#128736; 1. Definition & Paradigm</div>
                                <p class="info-text">${arch.definition}</p>
                            </div>
                            <div class="info-card">
                                <div class="info-title">&#9881; 2. Core Architecture</div>
                                <p class="info-text">${arch.coreArchitecture}</p>
                            </div>
                        </div>
                        <div class="info-card" style="margin-bottom: 24px;">
                            <div class="info-title">&#128221; 3. Key Characteristics</div>
                            <ul class="feature-list">
                                ${arch.keyPoints.map(p => `<li><span style="color:var(--cyan); font-weight: bold;">&#9670;</span> ${p}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="arch-grid">
                            <div class="info-card">
                                <div class="info-title" style="color: var(--emerald);">&#10004; 4. Key Advantages</div>
                                <ul class="feature-list">
                                    ${arch.advantages.map(a => `<li class="pro">&#10003; ${a}</li>`).join('')}
                                </ul>
                            </div>
                            <div class="info-card">
                                <div class="info-title" style="color: var(--rose);">&#10008; 5. Trade-Offs & Disadvantages</div>
                                <ul class="feature-list">
                                    ${arch.disadvantages.map(d => `<li class="con">&#10007; ${d}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                        <div class="info-card">
                            <div class="info-title">&#128187; Basic Syntax Demo</div>
                            <pre><code>${arch.basicSyntax}</code></pre>
                        </div>
                    `;
                } else if (currentTab === 'operations') {
                    container.innerHTML = currentTopicData.operations.map(op => `
                        <div class="op-box">
                            <div class="op-top">
                                <div class="op-name">Operation: ${op.name}</div>
                                <div class="op-badge-group">
                                    <span class="badge-pill">Time: ${op.timeComplexity}</span>
                                    <span class="badge-pill">Space: ${op.spaceComplexity}</span>
                                </div>
                            </div>
                            <pre style="margin-bottom: 14px;"><code>${op.syntax}</code></pre>
                            <p style="color: #cbd5e1; font-size: 1.08rem; margin-bottom: 12px; line-height: 1.65;"><strong>Internal Mechanics:</strong> ${op.internalWorking}</p>
                            <div style="font-size: 1rem; color: var(--text-muted);">
                                <strong style="color:#fff;">Execution Steps:</strong>
                                <ul style="margin-left: 28px; margin-top: 8px; line-height: 1.7;">
                                    ${op.mechanics.map(m => `<li>${m}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                    `).join('');
                } else if (currentTab === 'scenarios') {
                    container.innerHTML = `
                        <div class="scenarios-container">
                            ${currentTopicData.scenarios.map((sc, i) => `
                                <div class="sc-card">
                                    <div class="sc-header">
                                        <span class="sc-title">#${i+1} ${sc.domain}</span>
                                        <span class="sc-badge">Production</span>
                                    </div>
                                    <p style="color: #cbd5e1; font-size: 1.05rem; margin-bottom: 12px; line-height: 1.6;"><strong>Challenge:</strong> ${sc.problem}</p>
                                    <p style="color: var(--cyan); font-size: 1.02rem; line-height: 1.6;"><strong>Architecture:</strong> ${sc.solution}</p>
                                </div>
                            `).join('')}
                        </div>
                    `;
                } else if (currentTab === 'interview') {
                    container.innerHTML = currentTopicData.interviewQAs.map((qa, i) => `
                        <div class="qa-card">
                            <span class="qa-tier ${qa.category.includes('Service') ? 'qa-tier-service' : 'qa-tier-product'}">${qa.category} Tier</span>
                            <div class="qa-question">Q${i+1}: ${qa.question}</div>
                            <p style="color: #cbd5e1; font-size: 1.08rem; line-height: 1.7;">${qa.answer}</p>
                        </div>
                    `).join('');
                } else if (currentTab === 'quiz') {
                    container.innerHTML = `
                        <div class="quiz-head-bar">
                            <span style="font-weight: 700; font-size: 1.25rem;">Interactive Mastery Quiz (20 Questions)</span>
                            <span id="quizScoreDisplay" style="font-family: var(--font-mono); font-size: 1.15rem; color: var(--emerald); font-weight: 700;">Score: ${quizScore} / ${answeredCount}</span>
                        </div>
                        ${currentTopicData.quizzes.map((q, idx) => `
                            <div class="quiz-card" id="quizCard_${idx}">
                                <div style="display:flex; justify-content:space-between; margin-bottom: 12px;">
                                    <span style="font-size:0.9rem; color:var(--text-dim); font-weight:700;">Question ${idx+1} of 20</span>
                                    <span class="badge-pill">${q.difficulty}</span>
                                </div>
                                <div style="font-size: 1.18rem; font-weight: 600; color: #fff; margin-bottom: 16px; line-height: 1.55;">${q.question}</div>
                                <div class="quiz-options">
                                    ${q.options.map(opt => {
                                        const optLetter = opt.trim().charAt(0);
                                        return `<button class="quiz-opt" onclick="submitAnswer(${idx}, '${optLetter}', '${q.correctOption}')">${opt}</button>`;
                                    }).join('')}
                                </div>
                                <div class="quiz-exp" id="quizExp_${idx}">
                                    <strong>Explanation:</strong> ${q.explanation}
                                </div>
                            </div>
                        `).join('')}
                    `;
                }
            }

            function submitAnswer(qIdx, selected, correct) {
                const card = document.getElementById(`quizCard_${qIdx}`);
                if (card.dataset.answered) return;
                card.dataset.answered = "true";
                answeredCount++;

                const buttons = card.querySelectorAll('.quiz-opt');
                buttons.forEach(btn => {
                    const letter = btn.innerText.trim().charAt(0);
                    if (letter === correct) {
                        btn.classList.add('correct');
                    } else if (letter === selected && selected !== correct) {
                        btn.classList.add('wrong');
                    }
                    btn.disabled = true;
                });

                if (selected === correct) {
                    quizScore++;
                }

                document.getElementById(`quizExp_${qIdx}`).style.display = 'block';
                document.getElementById('quizScoreDisplay').innerText = `Score: ${quizScore} / ${answeredCount}`;
            }

            function buildControls() {
                const ctrl = document.getElementById('dynamicControls');
                if (currentTopic === 'ArrayList') {
                    ctrl.innerHTML = `
                        <div class="input-group"><label class="input-label">Payload Item:</label><input type="text" class="input-field" id="inItem" placeholder="e.g. Microservice"></div>
                        <div class="input-group"><label class="input-label">Index:</label><input type="number" class="input-field" id="inIdx" placeholder="0"></div>
                        <div class="ctrl-grid">
                            <button class="btn-action" onclick="callApi('add')">Add (Append)</button>
                            <button class="btn-action" onclick="callApi('insert')">Insert at Index</button>
                            <button class="btn-action btn-danger" onclick="callApi('removeIdx')">Remove by Index</button>
                            <button class="btn-action btn-danger" onclick="callApi('removeVal')">Remove by Value</button>
                            <button class="btn-action" onclick="callApi('get')">Get by Index</button>
                            <button class="btn-action" onclick="callApi('sort')">Sort Buffer</button>
                        </div>
                    `;
                } else if (currentTopic === 'LinkedList') {
                    ctrl.innerHTML = `
                        <div class="input-group"><label class="input-label">Node Payload:</label><input type="text" class="input-field" id="inItem" placeholder="e.g. Ingest-Worker"></div>
                        <div class="ctrl-grid">
                            <button class="btn-action" onclick="callApi('addFirst')">addFirst()</button>
                            <button class="btn-action" onclick="callApi('addLast')">addLast()</button>
                            <button class="btn-action btn-danger" onclick="callApi('removeFirst')">removeFirst()</button>
                            <button class="btn-action btn-danger" onclick="callApi('removeLast')">removeLast()</button>
                            <button class="btn-action" onclick="callApi('peek')">peekFirst()</button>
                            <button class="btn-action" onclick="callApi('sort')">Sort Nodes</button>
                        </div>
                    `;
                } else if (currentTopic === 'HashSet') {
                    ctrl.innerHTML = `
                        <div class="input-group"><label class="input-label">Element Key:</label><input type="text" class="input-field" id="inItem" placeholder="e.g. AUTH_TOKEN"></div>
                        <div class="ctrl-grid">
                            <button class="btn-action" onclick="callApi('add')">set.add()</button>
                            <button class="btn-action btn-danger" onclick="callApi('remove')">set.remove()</button>
                            <button class="btn-action" onclick="callApi('contains')">contains()</button>
                            <button class="btn-action" onclick="callApi('sort')">Export Sorted</button>
                        </div>
                    `;
                } else if (currentTopic === 'TreeSet') {
                    ctrl.innerHTML = `
                        <div class="input-group"><label class="input-label">Integer Key:</label><input type="number" class="input-field" id="inItem" placeholder="e.g. 50"></div>
                        <div class="ctrl-grid">
                            <button class="btn-action" onclick="callApi('add')">tree.add(x)</button>
                            <button class="btn-action btn-danger" onclick="callApi('remove')">tree.remove(x)</button>
                            <button class="btn-action" onclick="callApi('floor')">floor(x)</button>
                            <button class="btn-action" onclick="callApi('ceiling')">ceiling(x)</button>
                        </div>
                    `;
                } else if (currentTopic === 'HashMap') {
                    ctrl.innerHTML = `
                        <div class="input-group"><label class="input-label">Key:</label><input type="text" class="input-field" id="inKey" placeholder="e.g. CPU_CORE"></div>
                        <div class="input-group"><label class="input-label">Value (Integer):</label><input type="number" class="input-field" id="inVal" placeholder="e.g. 8"></div>
                        <div class="ctrl-grid">
                            <button class="btn-action" onclick="callApi('put')">map.put(K, V)</button>
                            <button class="btn-action btn-danger" onclick="callApi('remove')">map.remove(K)</button>
                            <button class="btn-action" onclick="callApi('get')">map.get(K)</button>
                            <button class="btn-action" onclick="callApi('sort')">Sort by Key</button>
                        </div>
                    `;
                } else if (currentTopic === 'Streams') {
                    ctrl.innerHTML = `
                        <div class="input-group"><label class="input-label">Source Integers:</label><input type="text" class="input-field" id="inItem" placeholder="10, 20, 30, 40, 50"></div>
                        <button class="btn-action" style="width: 100%; margin-bottom: 12px;" onclick="callApi('init')">Load Stream Source</button>
                        <div class="input-group"><label class="input-label">Filter Value (> X):</label><input type="number" class="input-field" id="inIdx" placeholder="20"></div>
                        <div class="ctrl-grid">
                            <button class="btn-action" onclick="callApi('filter')">.filter().toList()</button>
                            <button class="btn-action" onclick="callApi('map')">.map(n * 2)</button>
                            <button class="btn-action" onclick="callApi('sorted')">.sorted()</button>
                            <button class="btn-action" onclick="callApi('findFirst')">.findFirst()</button>
                        </div>
                    `;
                }
            }

            async function callApi(action) {
                const item = document.getElementById('inItem') ? document.getElementById('inItem').value : '';
                const key = document.getElementById('inKey') ? document.getElementById('inKey').value : '';
                const val = document.getElementById('inVal') ? document.getElementById('inVal').value : '';
                const index = document.getElementById('inIdx') ? document.getElementById('inIdx').value : '0';

                const response = await fetch('/api/execute', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ topic: currentTopic, action, item, key, val, index })
                });

                const data = await response.json();

                // Telemetry
                document.getElementById('sandboxConsole').innerText = 
`+--------------------------------------------------------------------------+
| DISPATCHED OP  : ${data.op}
| TIME COMPLEXITY: ${data.complexity}
| BEFORE STATE   : ${data.before}
| AFTER STATE    : ${data.after}
| STDOUT / RETURN: ${data.stdout}
+--------------------------------------------------------------------------+`;

                // Visualizer
                const visual = document.getElementById('visualContainer');
                visual.innerHTML = '';
                if (!data.items || data.items.length === 0) {
                    visual.innerHTML = '<span style="color: var(--text-dim); font-size: 1.05rem;">[Empty Collection Buffer]</span>';
                } else {
                    data.items.forEach((it, idx) => {
                        visual.innerHTML += `<div class="mem-node"><span class="mem-idx">${idx}</span>${it}</div>`;
                    });
                }
            }

            async function switchGlobal(type, title) {
                document.getElementById('tabBar').style.display = 'none';
                document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
                const matchedNav = Array.from(document.querySelectorAll('.nav-item')).find(el => el.innerText.includes(title));
                if (matchedNav) matchedNav.classList.add('active');

                document.getElementById('displayTopicTitle').innerText = title;
                const container = document.getElementById('contentBody');
                container.innerHTML = '<div style="color:var(--text-muted); padding:20px; font-size: 1.15rem;">Rendering architectural guide...</div>';

                const res = await fetch(`/api/global-data?type=${encodeURIComponent(type)}`);
                const data = await res.json();
                container.innerHTML = `<pre><code>${data.content}</code></pre>`;
            }

            // Init
            switchTopic('ArrayList');
        </script>
    </body>
    </html>
    """;
}
