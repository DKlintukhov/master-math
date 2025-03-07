/*
* MIT License

* Copyright (c) 2025 Denis Klintukhov

* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:

* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.

* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/


#ifndef EXPRESSION_H
#define EXPRESSION_H

#include <memory>
#include <variant>
#include <boost/json.hpp>

namespace Core
{
    using Json = boost::json::object;

    enum class Operation
    {
        Add,
        Sub,
        Mul,
        Div
    };

    class Constant;
    class BinaryOperation;

    using Expression = std::variant<Constant, BinaryOperation>;

    class Constant final
    {
    public:
        explicit Constant(double value);
        double Evaluate() const;
        Json ToJson() const;
        static Constant FromJson(const Json& json);

    private:
        double m_value;
    };

    class BinaryOperation final
    {
    public:
        BinaryOperation(Operation op, Expression left, Expression right);
        double Evaluate() const;
        Json ToJson() const;
        static BinaryOperation FromJson(const Json& json);

    private:
        Operation m_op;
        std::unique_ptr<Expression> m_left;
        std::unique_ptr<Expression> m_right;
    };

    Expression ExpressionFromJson(const Json& json);
    Json ToJson(const Expression& expr);
    double Evaluate(const Expression& expr);
}

#endif
