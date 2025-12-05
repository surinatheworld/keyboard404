# 🐱 ICY UNIVERSE - Game Design Document
### *"Một trò chơi dễ thương... cho đến khi bạn chơi nó."*

---

## 1. Tổng Quan

| **Thể loại** | 2D Platformer - Troll Game / Kaizo-lite |
|---|---|
| **Cảm hứng** | Cat Mario (Syobon Action), I Wanna Be The Guy |
| **Mục tiêu** | Tạo trải nghiệm vừa buồn cười, vừa ức chế, khiến người chơi muốn đập bàn phím nhưng vẫn tiếp tục chơi |
| **Đối tượng** | Streamer, người thích thử thách, masochist |

---

## 2. Phong Cách Nghệ Thuật

### Visual Style: "Dễ Thương Chết Người"
- **Đồ họa pixel 16-bit** với màu sắc pastel, tươi sáng
- Nhân vật chính là một **chú mèo/thỏ chibi** với đôi mắt to tròn
- Kẻ địch trông **vô hại** (mây cười, hoa dại, cầu vồng)
- Background **yên bình** như game trẻ em

> **Mục đích**: Tạo sự tương phản cực độ giữa vẻ ngoài và gameplay tàn bạo.

---

## 3. Cơ Chế Cốt Lõi

### 3.1 🎮 Bàn Phím Ngáo (Wonky Controls)

| **Tham số** | **Giá trị** |
|---|---|
| Chu kỳ kích hoạt | Mỗi 10-20 giây (random) |
| Thời gian "lỗi" | 5 giây |
| Cảnh báo | Không có (hoặc fake warning) |

**Các loại "lỗi":**

| Loại | Mô tả | Độ khó |
|---|---|---|
| **Delay Jump** | Nút nhảy bị delay 0.3-0.5s | ⭐⭐ |
| **Swap Controls** | Trái ↔ Phải bị đảo ngược | ⭐⭐⭐ |
| **Sticky Keys** | Nhân vật tiếp tục di chuyển sau khi thả phím | ⭐⭐ |
| **Double Tap** | Phải nhấn 2 lần để thực hiện hành động | ⭐⭐⭐ |
| **Random Input** | 20% xác suất input bị bỏ qua | ⭐⭐⭐⭐ |

**Cách tăng độ ức chế:**
- Hệ thống "học" timing của người chơi và kích hoạt lỗi vào **đúng lúc quan trọng nhất** (đang nhảy qua hố, đang né bẫy)
- Hiển thị popup giả: *"Keyboard Driver Updated!"* ngay trước khi lỗi xảy ra

---

### 3.2 🎲 Bẫy Ngẫu Nhiên (RNG Traps)

**Triết lý**: *"Bạn không thể học thuộc nếu game không nhất quán."*

| **Loại bẫy** | **Trigger** | **Xác suất** | **Hiệu ứng** |
|---|---|---|---|
| **Nền tảng phản bội** | Chạm vào platform | 10-15% | Platform biến mất hoặc rơi |
| **Gai bất ngờ** | Đứng yên > 1s | 20% | Gai mọc từ dưới chân |
| **Coin = Death** | Nhặt coin | 5% | Coin là bẫy, chết ngay |
| **Enemy Fake-out** | Giết enemy | 10% | Enemy nổ tung, bắn gai tứ phía |
| **Checkpoint Troll** | Chạm checkpoint | 5% | Checkpoint là bẫy giả |

**Quy tắc vàng của RNG:**
```
✅ RNG KHÔNG BAO GIỜ kích hoạt ở lần thử đầu tiên
   → Để người chơi tưởng rằng họ đã hiểu game
   
✅ RNG tăng dần sau mỗi lần chết
   → Càng chơi càng khó đoán
   
✅ RNG reset khi đổi level
   → Tạo hy vọng giả
```

---

### 3.3 🪤 Bẫy Cố Định (Hidden Traps)

| **Loại** | **Mô tả** |
|---|---|
| **Invisible Blocks** | Block vô hình xuất hiện khi nhảy, đẩy người chơi vào hố |
| **Fake Ground** | Nền đất trông bình thường nhưng là hố tử thần |
| **Reverse Gravity Zone** | Vùng đảo ngược trọng lực không có dấu hiệu |
| **Teleport Trap** | Portal troll đưa người chơi về đầu level |
| **Speed Tile** | Ô đất tăng tốc đột ngột, đẩy vào gai |

---

## 4. Thiết Kế Level

### Công Thức Troll Hoàn Hảo

```
Level = (Bẫy nhìn thấy × 20%) + (Bẫy ẩn × 50%) + (RNG × 30%)
```

### Nguyên Tắc Thiết Kế

1. **Phần đầu level dễ** → Tạo false sense of security
2. **Checkpoint đặt ở vị trí troll** → Ngay trước bẫy khó nhất
3. **Đường đi "hiển nhiên" luôn là bẫy** → Phải đi đường khó hơn
4. **Easter egg cho người kiên nhẫn** → Phần thưởng ẩn cho ai chết > 50 lần

---

## 5. Hệ Thống Tâm Lý

### 5.1 Death Counter (Công Khai)
- Hiển thị **to, rõ ràng** góc màn hình
- Có **leaderboard online** cho số lần chết nhiều nhất
- Achievement: *"Died 100 times - Are you okay?"*

### 5.2 Fake Encouragement
- Sau 10 lần chết: *"Bạn làm tốt lắm! (không đâu)"*
- Sau 50 lần chết: *"Có lẽ game này không dành cho bạn..."*
- Sau 100 lần chết: *"...Bạn vẫn còn đây à?"*

### 5.3 Audio Trolling
- Nhạc **vui tươi, catchy** khi người chơi đang khổ sở
- Tiếng cười **nhỏ, subtle** khi chết
- Nhạc **chuyển sang epic** khi gần hết level → rồi bẫy cuối cùng giết

---

## 6. UX/UI Troll

| **Element** | **Troll** |
|---|---|
| **Play Button** | Di chuyển khi hover lần đầu |
| **Pause Menu** | Nút "Resume" và "Quit" đổi chỗ random |
| **Volume Slider** | Đôi khi kéo ngược |
| **Loading Screen** | Fake loading 99% rồi restart |

---

## 7. Cách Tạo Cảm Xúc "Buồn Cười + Tức Giận"

### Công Thức Vàng:

```
Frustration + Absurdity = Comedy
(Ức chế)     (Phi lý)    (Hài hước)
```

**Thực hiện:**

1. **Timing hài hước**: Chết ngay sau khi nhặt được power-up
2. **Irony trực quan**: Biển báo "SAFE ZONE" ngay trước bẫy
3. **Self-aware humor**: Game biết nó troll và không giấu diếm
4. **Quick respawn**: Chết nhanh, hồi sinh nhanh → không có thời gian tức lâu
5. **Shareable moments**: Mỗi cái chết đều đáng để clip lại

---

## 8. Monetization (Nếu cần)

| **Loại** | **Mô tả** |
|---|---|
| **Skin nhân vật** | Không ảnh hưởng gameplay |
| **"Hint"** | Mua hint giả, vẫn troll |
| **"Skip Level"** | Có thể skip... với giá 1000 lần chết |

---

## 9. Tech Stack Đề Xuất

- **Engine**: Phaser.js / Godot / Unity 2D
- **Art**: Aseprite (pixel art)
- **Audio**: BFXR (sound effects retro)
- **Platform**: Web (itch.io), Steam

---

## 10. Tóm Tắt

> **Icy Universe** là game platformer giả vờ dễ thương nhưng thực chất là cơn ác mộng có tính toán. Với sự kết hợp của **bẫy ẩn**, **RNG bất công**, và **bàn phím ngáo**, game tạo ra trải nghiệm khiến người chơi vừa muốn **uninstall** vừa **không thể dừng chơi**.

**Tagline**: *"Đừng tin vào bất cứ thứ gì bạn thấy. Kể cả câu này."*

---

*GDD Version 1.0 - December 2025*
