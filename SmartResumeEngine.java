import java.io.*;
import java.util.*;

class Resume {
    String name;
    int skills;
    int experience;
    int score;
    Resume next;

    Resume(String name, int skills, int experience, int score) {
        this.name = name;
        this.skills = skills;
        this.experience = experience;
        this.score = score;
    }
}

class ResumeList {
    Resume head;

    void add(String name, int skills, int exp, int score) {
        Resume r = new Resume(name, skills, exp, score);
        if (head == null) {
            head = r;
            return;
        }
        Resume t = head;
        while (t.next != null) t = t.next;
        t.next = r;
    }

    Resume mergeSort(Resume h) {
        if (h == null || h.next == null) return h;

        Resume mid = getMiddle(h);
        Resume next = mid.next;
        mid.next = null;

        Resume left = mergeSort(h);
        Resume right = mergeSort(next);

        return merge(left, right);
    }

    Resume merge(Resume a, Resume b) {
        if (a == null) return b;
        if (b == null) return a;

        if (a.score >= b.score) {
            a.next = merge(a.next, b);
            return a;
        } else {
            b.next = merge(a, b.next);
            return b;
        }
    }

    Resume getMiddle(Resume h) {
        Resume slow = h, fast = h.next;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }
        return slow;
    }

    void sort() {
        head = mergeSort(head);
    }

    void saveToFile(String file) throws Exception {
        BufferedWriter bw = new BufferedWriter(new FileWriter(file));
        Resume t = head;
        while (t != null) {
            bw.write(t.name + "," + t.skills + "," + t.experience + "," + t.score);
            bw.newLine();
            t = t.next;
        }
        bw.close();
    }
}

public class SmartResumeEngine {

    static int calculateScore(int skills, int exp, int reqSkills) {
        return Math.min(skills, reqSkills) * 10 + exp * 5;
    }

    public static void main(String[] args) {
        int skills = 8;
        int experience = 3;
        int requiredSkills = 10;

        int score = calculateScore(skills, experience, requiredSkills);
        System.out.println("Resume Score: " + score);
    }
}